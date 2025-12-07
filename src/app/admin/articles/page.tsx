"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";

export default function AdminArticlesPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    imageUrl: "",
    categoryId: undefined as number | undefined,
    author: "",
    featured: false,
  });

  const utils = trpc.useUtils();
  const { data: articles, isLoading } = trpc.articles.list.useQuery();
  const { data: categories } = trpc.categories.list.useQuery();

  const createMutation = trpc.admin.articles.create.useMutation({
    onSuccess: () => {
      utils.articles.list.invalidate();
      setIsCreating(false);
      resetForm();
    },
  });

  const updateMutation = trpc.admin.articles.update.useMutation({
    onSuccess: () => {
      utils.articles.list.invalidate();
      setEditingId(null);
      resetForm();
    },
  });

  const deleteMutation = trpc.admin.articles.delete.useMutation({
    onSuccess: () => {
      utils.articles.list.invalidate();
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      imageUrl: "",
      categoryId: undefined,
      author: "",
      featured: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (article: NonNullable<typeof articles>[0]) => {
    setEditingId(article.id);
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || "",
      content: article.content,
      imageUrl: article.imageUrl || "",
      categoryId: article.categoryId || undefined,
      author: article.author || "",
      featured: article.featured || false,
    });
    setIsCreating(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบทความนี้?")) {
      deleteMutation.mutate({ id });
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId || !categories) return "-";
    return categories.find((c) => c.id === categoryId)?.name || "-";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">จัดการบทความ</h1>
          <p className="text-charcoal-500">เพิ่ม แก้ไข หรือลบบทความความรู้</p>
        </div>
        {!isCreating && (
          <Button variant="gold" onClick={() => setIsCreating(true)}>
            <Plus className="mr-2 h-4 w-4" />
            เพิ่มบทความ
          </Button>
        )}
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? "แก้ไขบทความ" : "เพิ่มบทความใหม่"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    หัวข้อ
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        title: e.target.value,
                        slug: generateSlug(e.target.value),
                      });
                    }}
                    placeholder="หัวข้อบทความ"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Slug</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="slug-url"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    หมวดหมู่
                  </label>
                  <select
                    value={formData.categoryId || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        categoryId: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="">เลือกหมวดหมู่</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    ผู้เขียน
                  </label>
                  <Input
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    placeholder="ชื่อผู้เขียน"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  ข้อความย่อ
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="ข้อความย่อของบทความ"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  rows={2}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  เนื้อหา (HTML)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="เนื้อหาบทความ (รองรับ HTML)"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
                  rows={10}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  URL รูปภาพ
                </label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="featured" className="text-sm font-medium">
                  แสดงเป็นบทความแนะนำ
                </label>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  variant="gold"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "กำลังบันทึก..."
                    : editingId
                    ? "อัปเดต"
                    : "สร้าง"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingId(null);
                    resetForm();
                  }}
                >
                  ยกเลิก
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Articles List */}
      <Card>
        <CardHeader>
          <CardTitle>บทความทั้งหมด ({articles?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-lg bg-charcoal-100"
                />
              ))}
            </div>
          ) : articles && articles.length > 0 ? (
            <div className="space-y-2">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-charcoal-50"
                >
                  <div className="flex items-center gap-4">
                    {article.imageUrl ? (
                      <div className="relative h-16 w-24 overflow-hidden rounded-lg">
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-charcoal-100">
                        <span className="text-2xl">📄</span>
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-charcoal">
                          {article.title}
                        </p>
                        {article.featured && (
                          <Star className="h-4 w-4 fill-gold text-gold" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-charcoal-500">
                        <span>{getCategoryName(article.categoryId)}</span>
                        {article.author && (
                          <>
                            <span>•</span>
                            <span>{article.author}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-charcoal-400 mr-4">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">{article.viewCount || 0}</span>
                    </div>
                    <Link href={`/articles/${article.slug}`} target="_blank">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(article)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(article.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-charcoal-500">ยังไม่มีบทความ</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
