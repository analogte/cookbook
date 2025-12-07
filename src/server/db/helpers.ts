import { db } from "./index";
import { eq, like, desc, asc, sql, inArray } from "drizzle-orm";
import {
  categories,
  recipes,
  ingredients,
  steps,
  tags,
  recipeTags,
  articles,
  recipeImages,
} from "./schema";

// Error wrapper for database operations
async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorMessage: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error(`Database Error: ${errorMessage}`, error);
    throw new Error(errorMessage);
  }
}

// Category helpers
export async function getAllCategories() {
  return withErrorHandling(
    () => db.select().from(categories).orderBy(asc(categories.sortOrder)),
    "Failed to fetch categories"
  );
}

export async function getCategoryBySlug(slug: string) {
  return withErrorHandling(async () => {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);
    return result[0] || null;
  }, `Failed to fetch category with slug: ${slug}`);
}

export async function getCategoryById(id: number) {
  return withErrorHandling(async () => {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
    return result[0] || null;
  }, `Failed to fetch category with id: ${id}`);
}

// Recipe helpers
export async function getAllRecipes(limit?: number) {
  return withErrorHandling(async () => {
    const query = db
      .select()
      .from(recipes)
      .orderBy(desc(recipes.createdAt));

    if (limit) {
      return query.limit(limit);
    }
    return query;
  }, "Failed to fetch recipes");
}

export async function getFeaturedRecipes(limit = 6) {
  return withErrorHandling(
    () =>
      db
        .select()
        .from(recipes)
        .where(eq(recipes.featured, true))
        .orderBy(desc(recipes.createdAt))
        .limit(limit),
    "Failed to fetch featured recipes"
  );
}

export async function getRecipesByCategory(categoryId: number) {
  return withErrorHandling(
    () =>
      db
        .select()
        .from(recipes)
        .where(eq(recipes.categoryId, categoryId))
        .orderBy(desc(recipes.createdAt)),
    `Failed to fetch recipes for category: ${categoryId}`
  );
}

export async function getRecipeBySlug(slug: string) {
  return withErrorHandling(async () => {
    const result = await db
      .select()
      .from(recipes)
      .where(eq(recipes.slug, slug))
      .limit(1);
    return result[0] || null;
  }, `Failed to fetch recipe with slug: ${slug}`);
}

export async function getRecipeById(id: number) {
  return withErrorHandling(async () => {
    const result = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, id))
      .limit(1);
    return result[0] || null;
  }, `Failed to fetch recipe with id: ${id}`);
}

export async function searchRecipes(query: string) {
  return withErrorHandling(
    () =>
      db
        .select()
        .from(recipes)
        .where(like(recipes.name, `%${query}%`))
        .orderBy(desc(recipes.createdAt)),
    `Failed to search recipes with query: ${query}`
  );
}

export async function getRecipeWithDetails(slug: string) {
  return withErrorHandling(async () => {
    const recipe = await getRecipeBySlug(slug);
    if (!recipe) return null;

    const [recipeIngredients, recipeSteps, recipeTags_, recipeGallery, category] =
      await Promise.all([
        getIngredientsByRecipe(recipe.id),
        getStepsByRecipe(recipe.id),
        getTagsByRecipe(recipe.id),
        getImagesByRecipe(recipe.id),
        recipe.categoryId ? getCategoryById(recipe.categoryId) : null,
      ]);

    return {
      ...recipe,
      category,
      ingredients: recipeIngredients,
      steps: recipeSteps,
      tags: recipeTags_,
      gallery: recipeGallery,
    };
  }, `Failed to fetch recipe details for slug: ${slug}`);
}

// Ingredient helpers
export async function getIngredientsByRecipe(recipeId: number) {
  return withErrorHandling(
    () =>
      db
        .select()
        .from(ingredients)
        .where(eq(ingredients.recipeId, recipeId))
        .orderBy(asc(ingredients.sortOrder)),
    `Failed to fetch ingredients for recipe: ${recipeId}`
  );
}

// Step helpers
export async function getStepsByRecipe(recipeId: number) {
  return withErrorHandling(
    () =>
      db
        .select()
        .from(steps)
        .where(eq(steps.recipeId, recipeId))
        .orderBy(asc(steps.stepNumber)),
    `Failed to fetch steps for recipe: ${recipeId}`
  );
}

// Tag helpers
export async function getAllTags() {
  return withErrorHandling(
    () => db.select().from(tags).orderBy(asc(tags.name)),
    "Failed to fetch tags"
  );
}

export async function getTagBySlug(slug: string) {
  return withErrorHandling(async () => {
    const result = await db
      .select()
      .from(tags)
      .where(eq(tags.slug, slug))
      .limit(1);
    return result[0] || null;
  }, `Failed to fetch tag with slug: ${slug}`);
}

export async function getTagsByRecipe(recipeId: number) {
  return withErrorHandling(
    () =>
      db
        .select({
          id: tags.id,
          name: tags.name,
          slug: tags.slug,
          color: tags.color,
        })
        .from(recipeTags)
        .innerJoin(tags, eq(recipeTags.tagId, tags.id))
        .where(eq(recipeTags.recipeId, recipeId)),
    `Failed to fetch tags for recipe: ${recipeId}`
  );
}

export async function getRecipesByTag(tagId: number) {
  return withErrorHandling(async () => {
    const recipeIds = await db
      .select({ recipeId: recipeTags.recipeId })
      .from(recipeTags)
      .where(eq(recipeTags.tagId, tagId));

    if (recipeIds.length === 0) return [];

    return db
      .select()
      .from(recipes)
      .where(
        inArray(
          recipes.id,
          recipeIds.map((r) => r.recipeId)
        )
      )
      .orderBy(desc(recipes.createdAt));
  }, `Failed to fetch recipes for tag: ${tagId}`);
}

// Article helpers
export async function getAllArticles(limit?: number) {
  return withErrorHandling(async () => {
    const query = db
      .select()
      .from(articles)
      .orderBy(desc(articles.createdAt));

    if (limit) {
      return query.limit(limit);
    }
    return query;
  }, "Failed to fetch articles");
}

export async function getFeaturedArticles(limit = 4) {
  return withErrorHandling(
    () =>
      db
        .select()
        .from(articles)
        .where(eq(articles.featured, true))
        .orderBy(desc(articles.createdAt))
        .limit(limit),
    "Failed to fetch featured articles"
  );
}

export async function getArticlesByCategory(categoryId: number) {
  return withErrorHandling(
    () =>
      db
        .select()
        .from(articles)
        .where(eq(articles.categoryId, categoryId))
        .orderBy(desc(articles.createdAt)),
    `Failed to fetch articles for category: ${categoryId}`
  );
}

export async function getArticleBySlug(slug: string) {
  return withErrorHandling(async () => {
    const result = await db
      .select()
      .from(articles)
      .where(eq(articles.slug, slug))
      .limit(1);
    return result[0] || null;
  }, `Failed to fetch article with slug: ${slug}`);
}

// Recipe images helpers
export async function getImagesByRecipe(recipeId: number) {
  return withErrorHandling(
    () =>
      db
        .select()
        .from(recipeImages)
        .where(eq(recipeImages.recipeId, recipeId))
        .orderBy(asc(recipeImages.sortOrder)),
    `Failed to fetch images for recipe: ${recipeId}`
  );
}

// Increment view count
export async function incrementRecipeViews(id: number) {
  return withErrorHandling(
    () =>
      db
        .update(recipes)
        .set({ viewCount: sql`${recipes.viewCount} + 1` })
        .where(eq(recipes.id, id)),
    `Failed to increment views for recipe: ${id}`
  );
}

export async function incrementArticleViews(id: number) {
  return withErrorHandling(
    () =>
      db
        .update(articles)
        .set({ viewCount: sql`${articles.viewCount} + 1` })
        .where(eq(articles.id, id)),
    `Failed to increment views for article: ${id}`
  );
}
