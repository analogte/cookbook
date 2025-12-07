import { Metadata } from "next";
import { ArticleCard } from "@/components/article-card";
import { api } from "@/lib/trpc-server";

export const metadata: Metadata = {
  title: "บทความความรู้",
  description: "บทความความรู้และเทคนิคการทำอาหาร เคล็ดลับจากเชฟมืออาชีพ",
};

export default async function ArticlesPage() {
  const [articles, categories] = await Promise.all([
    api.articles.list(),
    api.categories.list(),
  ]);

  const articlesWithCategory = articles.map((article) => ({
    ...article,
    category: categories.find((c) => c.id === article.categoryId) || null,
  }));

  return (
    <div className="py-section-md bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-gold">
            Knowledge
          </p>
          <h1 className="mt-2 font-display text-display-lg font-bold text-charcoal">
            บทความความรู้
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-charcoal-500">
            เรียนรู้เทคนิคการทำอาหาร เคล็ดลับจากเชฟมืออาชีพ และความรู้เกี่ยวกับวัตถุดิบ
          </p>
          <div className="divider-elegant mx-auto mt-6 max-w-xs">
            <span className="text-gold">✦</span>
          </div>
        </div>

        {/* Articles Grid */}
        {articlesWithCategory.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {articlesWithCategory.map((article, index) => (
              <ArticleCard
                key={article.id}
                article={article}
                featured={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center py-16">
            <p className="text-charcoal-500">ยังไม่มีบทความ</p>
          </div>
        )}
      </div>
    </div>
  );
}
