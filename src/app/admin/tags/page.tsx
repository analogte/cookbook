"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";

export default function AdminTagsPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    color: "#D4A574",
  });

  const utils = trpc.useUtils();
  const { data: tags, isLoading } = trpc.tags.list.useQuery();

  const createMutation = trpc.admin.tags.create.useMutation({
    onSuccess: () => {
      utils.tags.list.invalidate();
      setIsCreating(false);
      resetForm();
    },
  });

  const updateMutation = trpc.admin.tags.update.useMutation({
    onSuccess: () => {
      utils.tags.list.invalidate();
      setEditingId(null);
      resetForm();
    },
  });

  const deleteMutation = trpc.admin.tags.delete.useMutation({
    onSuccess: () => {
      utils.tags.list.invalidate();
    },
  });

  const resetForm = () => {
    setFormData({ name: "", slug: "", color: "#D4A574" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (tag: NonNullable<typeof tags>[0]) => {
    setEditingId(tag.id);
    setFormData({
      name: tag.name,
      slug: tag.slug,
      color: tag.color || "#D4A574",
    });
    setIsCreating(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบแท็กนี้?")) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">จัดการแท็ก</h1>
          <p className="text-charcoal-500">เพิ่ม แก้ไข หรือลบแท็ก</p>
        </div>
        {!isCreating && (
          <Button variant="gold" onClick={() => setIsCreating(true)}>
            <Plus className="mr-2 h-4 w-4" />
            เพิ่มแท็ก
          </Button>
        )}
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "แก้ไขแท็ก" : "เพิ่มแท็กใหม่"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
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
                    placeholder="ชื่อแท็ก"
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
                <div>
                  <label className="mb-1 block text-sm font-medium">สี</label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      className="h-10 w-14 p-1"
                    />
                    <Input
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      placeholder="#D4A574"
                    />
                  </div>
                </div>
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

      {/* Tags List */}
      <Card>
        <CardHeader>
          <CardTitle>แท็กทั้งหมด ({tags?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded-lg bg-charcoal-100"
                />
              ))}
            </div>
          ) : tags && tags.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="group flex items-center gap-2 rounded-full border px-4 py-2 transition-colors hover:bg-charcoal-50"
                  style={{ borderColor: tag.color || "#D4A574" }}
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: tag.color || "#D4A574" }}
                  />
                  <span className="font-medium text-charcoal">{tag.name}</span>
                  <div className="hidden gap-1 group-hover:flex">
                    <button
                      onClick={() => handleEdit(tag)}
                      className="rounded p-1 hover:bg-charcoal-100"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(tag.id)}
                      className="rounded p-1 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-charcoal-500">ยังไม่มีแท็ก</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
