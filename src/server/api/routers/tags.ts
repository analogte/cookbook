import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { getAllTags, getTagBySlug, getRecipesByTag } from "../../db/helpers";

export const tagsRouter = router({
  list: publicProcedure.query(async () => {
    return getAllTags();
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return getTagBySlug(input.slug);
    }),

  getRecipesByTag: publicProcedure
    .input(z.object({ tagId: z.number() }))
    .query(async ({ input }) => {
      return getRecipesByTag(input.tagId);
    }),

  getRecipesByTagSlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const tag = await getTagBySlug(input.slug);
      if (!tag) {
        return { tag: null, recipes: [] };
      }
      const recipes = await getRecipesByTag(tag.id);
      return { tag, recipes };
    }),
});
