import { Metadata } from "next";
import { Suspense } from "react";
import { RecipeCard } from "@/components/recipe-card";
import { SearchBar } from "@/components/search-bar";
import { FilterPanel } from "@/components/filter-panel";
import { api } from "@/lib/trpc-server";

export const metadata: Metadata = {
  title: "สูตรอาหารทั้งหมด",
  description: "ค้นหาและสำรวจสูตรอาหารหลากหลายประเภท พร้อมขั้นตอนการทำอย่างละเอียด",
};

interface RecipesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function RecipesList({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = typeof searchParams.q === "string" ? searchParams.q : undefined;

  let recipes;
  if (query) {
    recipes = await api.recipes.search({ query });
  } else {
    recipes = await api.recipes.list();
  }

  // Get categories and tags for each recipe
  const [categories] = await Promise.all([api.categories.list()]);

  const recipesWithCategory = recipes.map((recipe) => ({
    ...recipe,
    category: categories.find((c) => c.id === recipe.categoryId) || null,
  }));

  if (recipesWithCategory.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-charcoal-500">
          {query ? `ไม่พบสูตรอาหารที่ตรงกับ "${query}"` : "ยังไม่มีสูตรอาหาร"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recipesWithCategory.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const resolvedSearchParams = await searchParams;
  const [categories, tags] = await Promise.all([
    api.categories.list(),
    api.tags.list(),
  ]);

  return (
    <div className="py-section-md bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-gold">
            Recipes
          </p>
          <h1 className="mt-2 font-display text-display-lg font-bold text-charcoal">
            สูตรอาหารทั้งหมด
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-charcoal-500">
            ค้นหาสูตรอาหารที่คุณต้องการ หรือสำรวจสูตรใหม่ๆ ที่น่าสนใจ
          </p>
        </div>

        {/* Search Bar */}
        <div className="mx-auto mt-8 max-w-2xl">
          <Suspense fallback={<div className="h-10 bg-charcoal-100 animate-pulse rounded-md" />}>
            <SearchBar />
          </Suspense>
        </div>

        {/* Content */}
        <div className="mt-12 grid gap-8 lg:grid-cols-4">
          {/* Filters */}
          <aside className="lg:col-span-1">
            <Suspense fallback={<div className="h-64 bg-charcoal-100 animate-pulse rounded-lg" />}>
              <FilterPanel categories={categories} tags={tags} />
            </Suspense>
          </aside>

          {/* Recipes */}
          <div className="lg:col-span-3">
            <Suspense
              fallback={
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="h-80 bg-charcoal-100 animate-pulse rounded-lg"
                    />
                  ))}
                </div>
              }
            >
              <RecipesList searchParams={resolvedSearchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
