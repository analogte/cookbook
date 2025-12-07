import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChefHat, BookOpen, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/category-card";
import { RecipeCard } from "@/components/recipe-card";
import { ArticleCard } from "@/components/article-card";
import { api } from "@/lib/trpc-server";

export default async function HomePage() {
  const [categories, featuredRecipes, featuredArticles] = await Promise.all([
    api.categories.list(),
    api.recipes.featured({ limit: 6 }),
    api.articles.featured({ limit: 4 }),
  ]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-charcoal">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1920&q=80"
            alt="Elegant cuisine"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/50 via-charcoal/30 to-charcoal" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center">
          <p className="mb-4 font-serif text-lg tracking-widest text-gold uppercase">
            Premium Recipe Collection
          </p>
          <h1 className="font-display text-display-xl font-bold text-cream">
            ศิลปะแห่ง<span className="text-gold">การทำอาหาร</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-cream/80">
            ค้นพบสูตรอาหารพรีเมียมและเทคนิคการทำอาหารระดับเชฟ
            ที่จะยกระดับทักษะการทำอาหารของคุณไปอีกขั้น
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/recipes">
              <Button variant="gold" size="lg" className="min-w-[200px]">
                สำรวจสูตรอาหาร
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/categories">
              <Button
                variant="outline"
                size="lg"
                className="min-w-[200px] border-gold text-gold hover:bg-gold hover:text-charcoal"
              >
                ดูหมวดหมู่ทั้งหมด
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="h-10 w-6 rounded-full border-2 border-cream/30 p-1">
            <div className="h-2 w-1 mx-auto rounded-full bg-gold animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b border-gold/20 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
                <ChefHat className="h-8 w-8 text-gold" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-charcoal">
                สูตรระดับเชฟ
              </h3>
              <p className="mt-2 text-charcoal-500">
                สูตรอาหารที่ผ่านการทดสอบและพัฒนาโดยเชฟมืออาชีพ
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
                <BookOpen className="h-8 w-8 text-gold" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-charcoal">
                ขั้นตอนละเอียด
              </h3>
              <p className="mt-2 text-charcoal-500">
                คำอธิบายทีละขั้นตอนพร้อมเคล็ดลับจากผู้เชี่ยวชาญ
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
                <Utensils className="h-8 w-8 text-gold" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-charcoal">
                ครบทุกหมวดหมู่
              </h3>
              <p className="mt-2 text-charcoal-500">
                ตั้งแต่อาหารไทยดั้งเดิมไปจนถึงขนมหวานระดับพรีเมียม
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-section-md bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-gold">
              Explore
            </p>
            <h2 className="mt-2 font-display text-display-md font-bold text-charcoal">
              หมวดหมู่อาหาร
            </h2>
            <div className="divider-elegant mx-auto mt-4 max-w-xs">
              <span className="text-gold">✦</span>
            </div>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.slice(0, 6).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>

          {categories.length > 6 && (
            <div className="mt-10 text-center">
              <Link href="/categories">
                <Button className="bg-charcoal text-cream hover:bg-charcoal-700">
                  ดูหมวดหมู่ทั้งหมด
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="py-section-md bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-gold">
              Featured
            </p>
            <h2 className="mt-2 font-display text-display-md font-bold text-charcoal">
              สูตรอาหารแนะนำ
            </h2>
            <div className="divider-elegant mx-auto mt-4 max-w-xs">
              <span className="text-gold">✦</span>
            </div>
          </div>

          <div className="mt-12">
            {/* Featured recipe - large */}
            {featuredRecipes[0] && (
              <RecipeCard recipe={featuredRecipes[0]} featured className="mb-8" />
            )}

            {/* Other featured recipes */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredRecipes.slice(1, 4).map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/recipes">
              <Button variant="gold">
                ดูสูตรอาหารทั้งหมด
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      {featuredArticles.length > 0 && (
        <section className="py-section-md bg-cream">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-medium uppercase tracking-widest text-gold">
                Knowledge
              </p>
              <h2 className="mt-2 font-display text-display-md font-bold text-charcoal">
                บทความความรู้
              </h2>
              <div className="divider-elegant mx-auto mt-4 max-w-xs">
                <span className="text-gold">✦</span>
              </div>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {featuredArticles.map((article, index) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  featured={index === 0}
                />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link href="/articles">
                <Button variant="outline">
                  อ่านบทความทั้งหมด
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative py-section-lg overflow-hidden bg-charcoal">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-display-md font-bold text-cream">
            พร้อมที่จะเริ่มต้น<span className="text-gold">การเดินทาง</span>
            แห่งรสชาติ?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-cream/70">
            ค้นพบสูตรอาหารใหม่ๆ และเคล็ดลับการทำอาหารที่จะทำให้ทุกมื้ออาหารของคุณ
            กลายเป็นประสบการณ์สุดพิเศษ
          </p>
          <div className="mt-8">
            <Link href="/recipes">
              <Button variant="gold" size="lg">
                เริ่มสำรวจเลย
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
