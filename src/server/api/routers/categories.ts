import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { getAllCategories, getCategoryBySlug, getRecipesByCategory } from "../../db/helpers";

export const categoriesRouter = router({
  list: publicProcedure.query(async () => {
    return getAllCategories();
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const category = await getCategoryBySlug(input.slug);
      if (!category) {
        return null;
      }

      const recipes = await getRecipesByCategory(category.id);
      return {
        ...category,
        recipes,
      };
    }),
});
