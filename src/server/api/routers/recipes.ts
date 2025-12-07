import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import {
  getAllRecipes,
  getFeaturedRecipes,
  getRecipeBySlug,
  getRecipeWithDetails,
  searchRecipes,
  getRecipesByCategory,
  incrementRecipeViews,
  getTagsByRecipe,
} from "../../db/helpers";
import { getCategoryById } from "../../db/helpers";

export const recipesRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        categoryId: z.number().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      if (input?.categoryId) {
        return getRecipesByCategory(input.categoryId);
      }
      return getAllRecipes(input?.limit);
    }),

  featured: publicProcedure
    .input(z.object({ limit: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const recipes = await getFeaturedRecipes(input?.limit || 6);
      // Get category and tags for each recipe
      const recipesWithDetails = await Promise.all(
        recipes.map(async (recipe) => {
          const [category, tags] = await Promise.all([
            recipe.categoryId ? getCategoryById(recipe.categoryId) : null,
            getTagsByRecipe(recipe.id),
          ]);
          return { ...recipe, category, tags };
        })
      );
      return recipesWithDetails;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const recipe = await getRecipeWithDetails(input.slug);
      if (recipe) {
        // Increment view count
        incrementRecipeViews(recipe.id);
      }
      return recipe;
    }),

  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      if (!input.query.trim()) {
        return [];
      }
      return searchRecipes(input.query);
    }),

  filter: publicProcedure
    .input(
      z.object({
        categoryId: z.number().optional(),
        tagIds: z.array(z.number()).optional(),
        difficulty: z.enum(["easy", "medium", "hard"]).optional(),
        maxTime: z.number().optional(), // max total time in minutes
      })
    )
    .query(async ({ input }) => {
      // For now, just filter by category
      // Can be expanded to support more complex filtering
      if (input.categoryId) {
        return getRecipesByCategory(input.categoryId);
      }
      return getAllRecipes();
    }),
});
