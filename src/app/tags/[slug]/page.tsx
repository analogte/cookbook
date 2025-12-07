import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipeCard } from "@/components/recipe-card";
import { api } from "@/lib/trpc-server";

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { tag } = await api.tags.getRecipesByTagSlug({ slug });

  if (!tag) {
    return { title: "ไม่พบแท็ก" };
  }

  return {
    title: `สูตรอาหาร: ${tag.name}`,
    description: `สูตรอาหารที่มีแท็ก ${tag.name}`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const { tag, recipes } = await api.tags.getRecipesByTagSlug({ slug });
  const categories = await api.categories.list();

  if (!tag) {
    notFound();
  }

  const recipesWithCategory = recipes.map((recipe) => ({
    ...recipe,
    category: categories.find((c) => c.id === recipe.categoryId) || null,
  }));

  return (
    <div className="py-section-md bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-8">
          <Link href="/recipes">
            <Button variant="ghost" className="group">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              กลับไปหน้าสูตรอาหาร
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <div
            className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: `${tag.color || "#D4A574"}20` }}
          >
            <span
              className="text-2xl font-bold"
              style={{ color: tag.color || "#D4A574" }}
            >
              #
            </span>
          </div>
          <h1 className="font-display text-display-lg font-bold text-charcoal">
            {tag.name}
          </h1>
          <p className="mt-2 text-charcoal-500">
            {recipesWithCategory.length} สูตรอาหาร
          </p>
        </div>

        {/* Recipes Grid */}
        {recipesWithCategory.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipesWithCategory.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center py-16">
            <p className="text-charcoal-500">ไม่มีสูตรอาหารที่มีแท็กนี้</p>
            <Link href="/recipes" className="mt-4 inline-block">
              <Button variant="gold">ดูสูตรอาหารทั้งหมด</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
