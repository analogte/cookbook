import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipeCard } from "@/components/recipe-card";
import { api } from "@/lib/trpc-server";

interface CategoryDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await api.categories.getBySlug({ slug });

  if (!category) {
    return { title: "ไม่พบหมวดหมู่" };
  }

  return {
    title: category.name,
    description: category.description || `สูตรอาหารในหมวดหมู่ ${category.name}`,
  };
}

export default async function CategoryDetailPage({
  params,
}: CategoryDetailPageProps) {
  const { slug } = await params;
  const category = await api.categories.getBySlug({ slug });

  if (!category) {
    notFound();
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden bg-charcoal">
        {category.imageUrl && (
          <Image
            src={category.imageUrl}
            alt={category.name}
            fill
            className="object-cover opacity-40"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent" />

        <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
          {category.icon && (
            <span className="mb-4 text-5xl">{category.icon}</span>
          )}
          <h1 className="font-display text-display-lg font-bold text-cream">
            {category.name}
          </h1>
          {category.description && (
            <p className="mx-auto mt-4 max-w-2xl text-cream/80">
              {category.description}
            </p>
          )}
          <p className="mt-4 text-gold">
            {category.recipes.length} สูตรอาหาร
          </p>
        </div>
      </section>

      {/* Recipes Section */}
      <section className="py-section-md bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <div className="mb-8">
            <Link href="/categories">
              <Button variant="ghost" className="group">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                กลับไปหน้าหมวดหมู่
              </Button>
            </Link>
          </div>

          {/* Recipes Grid */}
          {category.recipes.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {category.recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={{
                    ...recipe,
                    category: { name: category.name, slug: category.slug },
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-charcoal-500">
                ยังไม่มีสูตรอาหารในหมวดหมู่นี้
              </p>
              <Link href="/recipes" className="mt-4 inline-block">
                <Button variant="gold">ดูสูตรอาหารทั้งหมด</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
