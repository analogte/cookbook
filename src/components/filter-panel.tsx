"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  categories: Array<{ id: number; name: string; slug: string }>;
  tags: Array<{ id: number; name: string; slug: string; color?: string | null }>;
  className?: string;
}

export function FilterPanel({ categories, tags, className }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const selectedCategory = searchParams.get("category");
  const selectedDifficulty = searchParams.get("difficulty");
  const selectedTags = searchParams.get("tags")?.split(",").filter(Boolean) || [];

  const difficulties = [
    { value: "easy", label: "ง่าย" },
    { value: "medium", label: "ปานกลาง" },
    { value: "hard", label: "ยาก" },
  ];

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/recipes?${params.toString()}`);
  };

  const toggleTag = (tagSlug: string) => {
    const newTags = selectedTags.includes(tagSlug)
      ? selectedTags.filter((t) => t !== tagSlug)
      : [...selectedTags, tagSlug];

    updateFilter("tags", newTags.length > 0 ? newTags.join(",") : null);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    const q = searchParams.get("q");
    if (q) params.set("q", q);
    router.push(`/recipes?${params.toString()}`);
  };

  const hasFilters = selectedCategory || selectedDifficulty || selectedTags.length > 0;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toggle button for mobile */}
      <div className="flex items-center justify-between lg:hidden">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          ตัวกรอง
          {hasFilters && (
            <Badge variant="gold" className="ml-1">
              {(selectedCategory ? 1 : 0) +
                (selectedDifficulty ? 1 : 0) +
                selectedTags.length}
            </Badge>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </Button>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-4 w-4" />
            ล้างตัวกรอง
          </Button>
        )}
      </div>

      {/* Filters */}
      <div
        className={cn(
          "space-y-6 rounded-lg border border-charcoal-100 bg-white p-6",
          "lg:block",
          isOpen ? "block" : "hidden"
        )}
      >
        {/* Category filter */}
        <div>
          <h4 className="mb-3 font-medium text-charcoal">หมวดหมู่</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.slug ? "gold" : "outline"}
                size="sm"
                onClick={() =>
                  updateFilter(
                    "category",
                    selectedCategory === category.slug ? null : category.slug
                  )
                }
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Difficulty filter */}
        <div>
          <h4 className="mb-3 font-medium text-charcoal">ระดับความยาก</h4>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((diff) => (
              <Button
                key={diff.value}
                variant={selectedDifficulty === diff.value ? "gold" : "outline"}
                size="sm"
                onClick={() =>
                  updateFilter(
                    "difficulty",
                    selectedDifficulty === diff.value ? null : diff.value
                  )
                }
              >
                {diff.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tags filter */}
        {tags.length > 0 && (
          <div>
            <h4 className="mb-3 font-medium text-charcoal">แท็ก</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.slug) ? "gold" : "outline"}
                  className="cursor-pointer transition-colors hover:bg-gold/20"
                  onClick={() => toggleTag(tag.slug)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Clear filters - desktop */}
        {hasFilters && (
          <div className="hidden lg:block">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-1 h-4 w-4" />
              ล้างตัวกรองทั้งหมด
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
