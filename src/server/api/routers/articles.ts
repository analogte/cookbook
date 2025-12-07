import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import {
  getAllArticles,
  getFeaturedArticles,
  getArticleBySlug,
  getArticlesByCategory,
  incrementArticleViews,
  getCategoryById,
} from "../../db/helpers";

export const articlesRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        categoryId: z.number().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      if (input?.categoryId) {
        return getArticlesByCategory(input.categoryId);
      }
      return getAllArticles(input?.limit);
    }),

  featured: publicProcedure
    .input(z.object({ limit: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const articles = await getFeaturedArticles(input?.limit || 4);
      // Get category for each article
      const articlesWithCategory = await Promise.all(
        articles.map(async (article) => {
          const category = article.categoryId
            ? await getCategoryById(article.categoryId)
            : null;
          return { ...article, category };
        })
      );
      return articlesWithCategory;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const article = await getArticleBySlug(input.slug);
      if (article) {
        // Increment view count
        incrementArticleViews(article.id);

        // Get category
        const category = article.categoryId
          ? await getCategoryById(article.categoryId)
          : null;
        return { ...article, category };
      }
      return null;
    }),
});
