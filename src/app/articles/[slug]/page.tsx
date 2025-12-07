import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Eye, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/trpc-server";
import { formatDate } from "@/lib/utils";

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await api.articles.getBySlug({ slug });

  if (!article) {
    return { title: "ไม่พบบทความ" };
  }

  return {
    title: article.title,
    description: article.excerpt || `บทความ ${article.title}`,
  };
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { slug } = await params;
  const article = await api.articles.getBySlug({ slug });

  if (!article) {
    notFound();
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden bg-charcoal">
        {article.imageUrl && (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover opacity-40"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />

        <div className="relative flex h-full flex-col justify-end px-4 pb-12 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-3xl">
            {/* Category */}
            {article.category && (
              <Link
                href={`/categories/${article.category.slug}`}
                className="inline-block"
              >
                <Badge variant="gold" className="mb-4">
                  {article.category.name}
                </Badge>
              </Link>
            )}

            {/* Title */}
            <h1 className="font-display text-display-lg font-bold text-cream">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="mt-6 flex flex-wrap items-center gap-6 text-cream/70">
              {article.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gold" />
                  <span>{formatDate(article.createdAt)}</span>
                </div>
              )}
              {article.author && (
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gold" />
                  <span>{article.author}</span>
                </div>
              )}
              {article.viewCount !== undefined && article.viewCount !== null && (
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-gold" />
                  <span>{article.viewCount.toLocaleString()} views</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-section-md bg-cream">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <div className="mb-8">
            <Link href="/articles">
              <Button variant="ghost" className="group">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                กลับไปหน้าบทความ
              </Button>
            </Link>
          </div>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="mb-8 text-xl text-charcoal-600 leading-relaxed border-l-4 border-gold pl-6 italic">
              {article.excerpt}
            </p>
          )}

          {/* Content */}
          <article className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-charcoal prose-p:text-charcoal-600 prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-strong:text-charcoal prose-img:rounded-lg">
            <div
              dangerouslySetInnerHTML={{ __html: article.content }}
              className="article-content"
            />
          </article>

          {/* Share */}
          <div className="mt-12 border-t border-gold/20 pt-8">
            <p className="text-sm text-charcoal-500">แชร์บทความนี้:</p>
            <div className="mt-4 flex gap-3">
              <Button variant="outline" size="sm">
                Facebook
              </Button>
              <Button variant="outline" size="sm">
                Twitter
              </Button>
              <Button variant="outline" size="sm">
                Line
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
