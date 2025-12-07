"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";

export default function AdminRecipesPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    categoryId: undefined as number | undefined,
    prepTime: undefined as number | undefined,
    cookTime: undefined as number | undefined,
    servings: undefined as number | undefined,
    difficulty: "easy" as "easy" | "medium" | "hard",
    tips: "",
    featured: false,
  });

  const utils = trpc.useUtils();
  const { data: recipes, isLoading } = trpc.recipes.list.useQuery();
  const { data: categories } = trpc.categories.list.useQuery();

  const createMutation = trpc.admin.recipes.create.useMutation({
    onSuccess: () => {
      utils.recipes.list.invalidate();
      setIsCreating(false);
      resetForm();
    },
  });

  const updateMutation = trpc.admin.recipes.update.useMutation({
    onSuccess: () => {
      utils.recipes.list.invalidate();
      setEditingId(null);
      resetForm();
    },
  });

  const deleteMutation = trpc.admin.recipes.delete.useMutation({
    onSuccess: () => {
      utils.recipes.list.invalidate();
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      imageUrl: "",
      categoryId: undefined,
      prepTime: undefined,
      cookTime: undefined,
      servings: undefined,
      difficulty: "easy",
      tips: "",
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

  const handleEdit = (recipe: NonNullable<typeof recipes>[0]) => {
    setEditingId(recipe.id);
    setFormData({
      name: recipe.name,
      slug: recipe.slug,
      description: recipe.description || "",
      imageUrl: recipe.imageUrl || "",
      categoryId: recipe.categoryId || undefined,
      prepTime: recipe.prepTime || undefined,
      cookTime: recipe.cookTime || undefined,
      servings: recipe.servings || undefined,
      difficulty: (recipe.difficulty as "easy" | "medium" | "hard") || "easy",
      tips: recipe.tips || "",
      featured: recipe.featured || false,
    });
    setIsCreating(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบสูตรนี้?")) {
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
          <h1 className="text-2xl font-bold text-charcoal">จัดการสูตรอาหาร</h1>
          <p className="text-charcoal-500">เพิ่ม แก้ไข หรือลบสูตรอาหาร</p>
        </div>
        {!isCreating && (
          <Button variant="gold" onClick={() => setIsCreating(true)}>
            <Plus className="mr-2 h-4 w-4" />
            เพิ่มสูตร
          </Button>
        )}
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? "แก้ไขสูตรอาหาร" : "เพิ่มสูตรใหม่"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">ชื่อ</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        name: e.target.value,
                        slug: generateSlug(e.target.value),
                      });
                    }}
                    placeholder="ชื่อสูตรอาหาร"
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
                    ระดับความยาก
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        difficulty: e.target.value as "easy" | "medium" | "hard",
                      })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="easy">ง่าย</option>
                    <option value="medium">ปานกลาง</option>
                    <option value="hard">ยาก</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">คำอธิบาย</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="คำอธิบายสูตรอาหาร"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  rows={3}
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

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    เวลาเตรียม (นาที)
                  </label>
                  <Input
                    type="number"
                    value={formData.prepTime || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        prepTime: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="15"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    เวลาปรุง (นาที)
                  </label>
                  <Input
                    type="number"
                    value={formData.cookTime || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cookTime: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    จำนวนที่
                  </label>
                  <Input
                    type="number"
                    value={formData.servings || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        servings: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="4"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">เคล็ดลับ</label>
                <textarea
                  value={formData.tips}
                  onChange={(e) =>
                    setFormData({ ...formData, tips: e.target.value })
                  }
                  placeholder="เคล็ดลับการทำ"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  rows={2}
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
                  แสดงเป็นสูตรแนะนำ
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

      {/* Recipes List */}
      <Card>
        <CardHeader>
          <CardTitle>สูตรอาหารทั้งหมด ({recipes?.length || 0})</CardTitle>
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
          ) : recipes && recipes.length > 0 ? (
            <div className="space-y-2">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-charcoal-50"
                >
                  <div className="flex items-center gap-4">
                    {recipe.imageUrl ? (
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                        <Image
                          src={recipe.imageUrl}
                          alt={recipe.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-charcoal-100">
                        <span className="text-2xl">🍽️</span>
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-charcoal">
                          {recipe.name}
                        </p>
                        {recipe.featured && (
                          <Star className="h-4 w-4 fill-gold text-gold" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-charcoal-500">
                        <span>{getCategoryName(recipe.categoryId)}</span>
                        <span>•</span>
                        <Badge
                          variant={
                            recipe.difficulty === "easy"
                              ? "gold"
                              : recipe.difficulty === "medium"
                              ? "secondary"
                              : "burgundy"
                          }
                          className="text-xs"
                        >
                          {recipe.difficulty === "easy"
                            ? "ง่าย"
                            : recipe.difficulty === "medium"
                            ? "ปานกลาง"
                            : "ยาก"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-charcoal-400 mr-4">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">{recipe.viewCount || 0}</span>
                    </div>
                    <Link href={`/recipes/${recipe.slug}`} target="_blank">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(recipe)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(recipe.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-charcoal-500">ยังไม่มีสูตรอาหาร</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
