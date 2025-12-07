import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { db } from "../../db";
import {
  categories,
  recipes,
  ingredients,
  steps,
  tags,
  recipeTags,
  articles,
  recipeImages,
} from "../../db/schema";
import { eq } from "drizzle-orm";

// Category schemas
const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().optional(),
  imageUrl: z.string().optional(),
  sortOrder: z.number().optional(),
});

// Recipe schemas
const recipeSchema = z.object({
  categoryId: z.number().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  prepTime: z.number().optional(),
  cookTime: z.number().optional(),
  servings: z.number().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  tips: z.string().optional(),
  videoUrl: z.string().optional(),
  featured: z.boolean().optional(),
});

const ingredientSchema = z.object({
  recipeId: z.number(),
  name: z.string().min(1),
  amount: z.number().optional(),
  unit: z.string().optional(),
  notes: z.string().optional(),
  groupName: z.string().optional(),
  sortOrder: z.number().optional(),
});

const stepSchema = z.object({
  recipeId: z.number(),
  stepNumber: z.number(),
  instruction: z.string().min(1),
  imageUrl: z.string().optional(),
  duration: z.number().optional(),
  tips: z.string().optional(),
});

// Article schema
const articleSchema = z.object({
  categoryId: z.number().optional(),
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  imageUrl: z.string().optional(),
  author: z.string().optional(),
  featured: z.boolean().optional(),
});

// Tag schema
const tagSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  color: z.string().optional(),
});

export const adminRouter = router({
  // Categories CRUD
  categories: router({
    create: protectedProcedure.input(categorySchema).mutation(async ({ input }) => {
      const result = await db.insert(categories).values(input).returning();
      return result[0];
    }),

    update: protectedProcedure
      .input(z.object({ id: z.number(), data: categorySchema.partial() }))
      .mutation(async ({ input }) => {
        const result = await db
          .update(categories)
          .set({ ...input.data, updatedAt: new Date().toISOString() })
          .where(eq(categories.id, input.id))
          .returning();
        return result[0];
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.delete(categories).where(eq(categories.id, input.id));
        return { success: true };
      }),
  }),

  // Recipes CRUD
  recipes: router({
    create: protectedProcedure.input(recipeSchema).mutation(async ({ input }) => {
      const result = await db.insert(recipes).values(input).returning();
      return result[0];
    }),

    update: protectedProcedure
      .input(z.object({ id: z.number(), data: recipeSchema.partial() }))
      .mutation(async ({ input }) => {
        const result = await db
          .update(recipes)
          .set({ ...input.data, updatedAt: new Date().toISOString() })
          .where(eq(recipes.id, input.id))
          .returning();
        return result[0];
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.delete(recipes).where(eq(recipes.id, input.id));
        return { success: true };
      }),

    setTags: protectedProcedure
      .input(z.object({ recipeId: z.number(), tagIds: z.array(z.number()) }))
      .mutation(async ({ input }) => {
        // Delete existing tags
        await db.delete(recipeTags).where(eq(recipeTags.recipeId, input.recipeId));

        // Insert new tags
        if (input.tagIds.length > 0) {
          await db.insert(recipeTags).values(
            input.tagIds.map((tagId) => ({
              recipeId: input.recipeId,
              tagId,
            }))
          );
        }
        return { success: true };
      }),
  }),

  // Ingredients CRUD
  ingredients: router({
    create: protectedProcedure.input(ingredientSchema).mutation(async ({ input }) => {
      const result = await db.insert(ingredients).values(input).returning();
      return result[0];
    }),

    createMany: protectedProcedure
      .input(z.array(ingredientSchema))
      .mutation(async ({ input }) => {
        if (input.length === 0) return [];
        const result = await db.insert(ingredients).values(input).returning();
        return result;
      }),

    update: protectedProcedure
      .input(z.object({ id: z.number(), data: ingredientSchema.partial() }))
      .mutation(async ({ input }) => {
        const result = await db
          .update(ingredients)
          .set(input.data)
          .where(eq(ingredients.id, input.id))
          .returning();
        return result[0];
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.delete(ingredients).where(eq(ingredients.id, input.id));
        return { success: true };
      }),

    deleteByRecipe: protectedProcedure
      .input(z.object({ recipeId: z.number() }))
      .mutation(async ({ input }) => {
        await db.delete(ingredients).where(eq(ingredients.recipeId, input.recipeId));
        return { success: true };
      }),
  }),

  // Steps CRUD
  steps: router({
    create: protectedProcedure.input(stepSchema).mutation(async ({ input }) => {
      const result = await db.insert(steps).values(input).returning();
      return result[0];
    }),

    createMany: protectedProcedure
      .input(z.array(stepSchema))
      .mutation(async ({ input }) => {
        if (input.length === 0) return [];
        const result = await db.insert(steps).values(input).returning();
        return result;
      }),

    update: protectedProcedure
      .input(z.object({ id: z.number(), data: stepSchema.partial() }))
      .mutation(async ({ input }) => {
        const result = await db
          .update(steps)
          .set(input.data)
          .where(eq(steps.id, input.id))
          .returning();
        return result[0];
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.delete(steps).where(eq(steps.id, input.id));
        return { success: true };
      }),

    deleteByRecipe: protectedProcedure
      .input(z.object({ recipeId: z.number() }))
      .mutation(async ({ input }) => {
        await db.delete(steps).where(eq(steps.recipeId, input.recipeId));
        return { success: true };
      }),
  }),

  // Tags CRUD
  tags: router({
    create: protectedProcedure.input(tagSchema).mutation(async ({ input }) => {
      const result = await db.insert(tags).values(input).returning();
      return result[0];
    }),

    update: protectedProcedure
      .input(z.object({ id: z.number(), data: tagSchema.partial() }))
      .mutation(async ({ input }) => {
        const result = await db
          .update(tags)
          .set(input.data)
          .where(eq(tags.id, input.id))
          .returning();
        return result[0];
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.delete(tags).where(eq(tags.id, input.id));
        return { success: true };
      }),
  }),

  // Articles CRUD
  articles: router({
    create: protectedProcedure.input(articleSchema).mutation(async ({ input }) => {
      const result = await db.insert(articles).values(input).returning();
      return result[0];
    }),

    update: protectedProcedure
      .input(z.object({ id: z.number(), data: articleSchema.partial() }))
      .mutation(async ({ input }) => {
        const result = await db
          .update(articles)
          .set({ ...input.data, updatedAt: new Date().toISOString() })
          .where(eq(articles.id, input.id))
          .returning();
        return result[0];
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.delete(articles).where(eq(articles.id, input.id));
        return { success: true };
      }),
  }),

  // Recipe Images CRUD
  recipeImages: router({
    create: protectedProcedure
      .input(
        z.object({
          recipeId: z.number(),
          imageUrl: z.string(),
          caption: z.string().optional(),
          sortOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const result = await db.insert(recipeImages).values(input).returning();
        return result[0];
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.delete(recipeImages).where(eq(recipeImages.id, input.id));
        return { success: true };
      }),
  }),
});
