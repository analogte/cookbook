import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Clock,
  Users,
  ChefHat,
  Printer,
  Share2,
  BookmarkPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TagBadge } from "@/components/tag-badge";
import { GalleryView } from "@/components/gallery-view";
import { api } from "@/lib/trpc-server";
import { formatTime } from "@/lib/utils";

interface RecipeDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: RecipeDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await api.recipes.getBySlug({ slug });

  if (!recipe) {
    return { title: "ไม่พบสูตรอาหาร" };
  }

  return {
    title: recipe.name,
    description: recipe.description || `สูตร ${recipe.name}`,
  };
}

export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps) {
  const { slug } = await params;
  const recipe = await api.recipes.getBySlug({ slug });

  if (!recipe) {
    notFound();
  }

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  // Group ingredients by groupName
  const ingredientGroups = recipe.ingredients.reduce(
    (acc, ingredient) => {
      const group = ingredient.groupName || "ส่วนผสมหลัก";
      if (!acc[group]) acc[group] = [];
      acc[group].push(ingredient);
      return acc;
    },
    {} as Record<string, typeof recipe.ingredients>
  );

  return (
    <div className="recipe-print">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden bg-charcoal">
        {recipe.imageUrl && (
          <Image
            src={recipe.imageUrl}
            alt={recipe.name}
            fill
            className="object-cover opacity-50"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />

        <div className="relative flex h-full flex-col justify-end px-4 pb-12 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-4xl">
            {/* Category */}
            {recipe.category && (
              <Link
                href={`/categories/${recipe.category.slug}`}
                className="inline-block"
              >
                <Badge variant="gold" className="mb-4">
                  {recipe.category.name}
                </Badge>
              </Link>
            )}

            {/* Title */}
            <h1 className="font-display text-display-lg font-bold text-cream">
              {recipe.name}
            </h1>

            {/* Description */}
            {recipe.description && (
              <p className="mt-4 max-w-2xl text-lg text-cream/80">
                {recipe.description}
              </p>
            )}

            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <TagBadge key={tag.id} tag={tag} />
                ))}
              </div>
            )}

            {/* Meta */}
            <div className="mt-6 flex flex-wrap items-center gap-6 text-cream/70">
              {totalTime > 0 && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gold" />
                  <span>{formatTime(totalTime)}</span>
                </div>
              )}
              {recipe.servings && (
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gold" />
                  <span>{recipe.servings} ที่</span>
                </div>
              )}
              {recipe.difficulty && (
                <div className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-gold" />
                  <span>
                    {recipe.difficulty === "easy"
                      ? "ง่าย"
                      : recipe.difficulty === "medium"
                      ? "ปานกลาง"
                      : "ยาก"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-section-md bg-cream">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back button and actions */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 no-print">
            <Link href="/recipes">
              <Button variant="ghost" className="group">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                กลับไปหน้าสูตรอาหาร
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
              >
                <Printer className="mr-2 h-4 w-4" />
                พิมพ์
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                แชร์
              </Button>
              <Button variant="outline" size="sm">
                <BookmarkPlus className="mr-2 h-4 w-4" />
                บันทึก
              </Button>
            </div>
          </div>

          {/* Time breakdown */}
          {(recipe.prepTime || recipe.cookTime) && (
            <div className="mb-8 grid grid-cols-2 gap-4 rounded-lg border border-gold/20 bg-white p-6 sm:grid-cols-4">
              {recipe.prepTime && (
                <div className="text-center">
                  <p className="text-sm text-charcoal-500">เตรียม</p>
                  <p className="mt-1 font-display text-xl font-semibold text-charcoal">
                    {formatTime(recipe.prepTime)}
                  </p>
                </div>
              )}
              {recipe.cookTime && (
                <div className="text-center">
                  <p className="text-sm text-charcoal-500">ปรุง</p>
                  <p className="mt-1 font-display text-xl font-semibold text-charcoal">
                    {formatTime(recipe.cookTime)}
                  </p>
                </div>
              )}
              {totalTime > 0 && (
                <div className="text-center">
                  <p className="text-sm text-charcoal-500">รวม</p>
                  <p className="mt-1 font-display text-xl font-semibold text-gold">
                    {formatTime(totalTime)}
                  </p>
                </div>
              )}
              {recipe.servings && (
                <div className="text-center">
                  <p className="text-sm text-charcoal-500">สำหรับ</p>
                  <p className="mt-1 font-display text-xl font-semibold text-charcoal">
                    {recipe.servings} ที่
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Ingredients */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-lg border border-gold/20 bg-white p-6">
                <h2 className="font-display text-xl font-semibold text-charcoal">
                  ส่วนผสม
                </h2>

                {Object.entries(ingredientGroups).map(([group, items]) => (
                  <div key={group} className="mt-4">
                    {Object.keys(ingredientGroups).length > 1 && (
                      <h3 className="mb-2 text-sm font-medium text-gold">
                        {group}
                      </h3>
                    )}
                    <ul className="space-y-2">
                      {items.map((ingredient) => (
                        <li
                          key={ingredient.id}
                          className="flex items-start gap-2 text-charcoal-600"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                          <span>
                            {ingredient.amount && (
                              <span className="font-medium">
                                {ingredient.amount}
                              </span>
                            )}{" "}
                            {ingredient.unit && <span>{ingredient.unit}</span>}{" "}
                            {ingredient.name}
                            {ingredient.notes && (
                              <span className="text-charcoal-400">
                                {" "}
                                ({ingredient.notes})
                              </span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="lg:col-span-2">
              <h2 className="font-display text-xl font-semibold text-charcoal">
                ขั้นตอนการทำ
              </h2>

              <div className="mt-6 space-y-6">
                {recipe.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="rounded-lg border border-charcoal-100 bg-white p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gold font-display font-semibold text-charcoal">
                        {step.stepNumber}
                      </div>
                      <div className="flex-1">
                        <p className="text-charcoal-700">{step.instruction}</p>

                        {step.tips && (
                          <div className="mt-3 rounded-md bg-gold/10 p-3">
                            <p className="text-sm text-gold-800">
                              <span className="font-medium">💡 เคล็ดลับ:</span>{" "}
                              {step.tips}
                            </p>
                          </div>
                        )}

                        {step.duration && (
                          <p className="mt-2 text-sm text-charcoal-400">
                            <Clock className="mr-1 inline h-3.5 w-3.5" />
                            {formatTime(step.duration)}
                          </p>
                        )}

                        {step.imageUrl && (
                          <div className="mt-4">
                            <Image
                              src={step.imageUrl}
                              alt={`ขั้นตอนที่ ${step.stepNumber}`}
                              width={600}
                              height={400}
                              className="rounded-lg object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tips section */}
              {recipe.tips && (
                <div className="mt-8 rounded-lg border-2 border-gold/30 bg-gold/5 p-6">
                  <h3 className="font-display text-lg font-semibold text-charcoal">
                    💡 เคล็ดลับเพิ่มเติม
                  </h3>
                  <p className="mt-2 text-charcoal-600">{recipe.tips}</p>
                </div>
              )}

              {/* Gallery */}
              {recipe.gallery && recipe.gallery.length > 0 && (
                <div className="mt-8 no-print">
                  <h3 className="mb-4 font-display text-lg font-semibold text-charcoal">
                    รูปภาพประกอบ
                  </h3>
                  <GalleryView images={recipe.gallery} />
                </div>
              )}

              {/* Video */}
              {recipe.videoUrl && (
                <div className="mt-8 no-print">
                  <h3 className="mb-4 font-display text-lg font-semibold text-charcoal">
                    วิดีโอสอนทำ
                  </h3>
                  <div className="aspect-video overflow-hidden rounded-lg">
                    <iframe
                      src={recipe.videoUrl}
                      className="h-full w-full"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
