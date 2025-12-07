import { db } from "./index";
import { eq, like, and, desc, asc, sql, inArray } from "drizzle-orm";
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

// Category helpers
export async function getAllCategories() {
  return db.select().from(categories).orderBy(asc(categories.sortOrder));
}

export async function getCategoryBySlug(slug: string) {
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  return result[0] || null;
}

export async function getCategoryById(id: number) {
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);
  return result[0] || null;
}

// Recipe helpers
export async function getAllRecipes(limit?: number) {
  const query = db
    .select()
    .from(recipes)
    .orderBy(desc(recipes.createdAt));

  if (limit) {
    return query.limit(limit);
  }
  return query;
}

export async function getFeaturedRecipes(limit = 6) {
  return db
    .select()
    .from(recipes)
    .where(eq(recipes.featured, true))
    .orderBy(desc(recipes.createdAt))
    .limit(limit);
}

export async function getRecipesByCategory(categoryId: number) {
  return db
    .select()
    .from(recipes)
    .where(eq(recipes.categoryId, categoryId))
    .orderBy(desc(recipes.createdAt));
}

export async function getRecipeBySlug(slug: string) {
  const result = await db
    .select()
    .from(recipes)
    .where(eq(recipes.slug, slug))
    .limit(1);
  return result[0] || null;
}

export async function getRecipeById(id: number) {
  const result = await db
    .select()
    .from(recipes)
    .where(eq(recipes.id, id))
    .limit(1);
  return result[0] || null;
}

export async function searchRecipes(query: string) {
  return db
    .select()
    .from(recipes)
    .where(like(recipes.name, `%${query}%`))
    .orderBy(desc(recipes.createdAt));
}

export async function getRecipeWithDetails(slug: string) {
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
}

// Ingredient helpers
export async function getIngredientsByRecipe(recipeId: number) {
  return db
    .select()
    .from(ingredients)
    .where(eq(ingredients.recipeId, recipeId))
    .orderBy(asc(ingredients.sortOrder));
}

// Step helpers
export async function getStepsByRecipe(recipeId: number) {
  return db
    .select()
    .from(steps)
    .where(eq(steps.recipeId, recipeId))
    .orderBy(asc(steps.stepNumber));
}

// Tag helpers
export async function getAllTags() {
  return db.select().from(tags).orderBy(asc(tags.name));
}

export async function getTagBySlug(slug: string) {
  const result = await db
    .select()
    .from(tags)
    .where(eq(tags.slug, slug))
    .limit(1);
  return result[0] || null;
}

export async function getTagsByRecipe(recipeId: number) {
  const result = await db
    .select({
      id: tags.id,
      name: tags.name,
      slug: tags.slug,
      color: tags.color,
    })
    .from(recipeTags)
    .innerJoin(tags, eq(recipeTags.tagId, tags.id))
    .where(eq(recipeTags.recipeId, recipeId));
  return result;
}

export async function getRecipesByTag(tagId: number) {
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
}

// Article helpers
export async function getAllArticles(limit?: number) {
  const query = db
    .select()
    .from(articles)
    .orderBy(desc(articles.createdAt));

  if (limit) {
    return query.limit(limit);
  }
  return query;
}

export async function getFeaturedArticles(limit = 4) {
  return db
    .select()
    .from(articles)
    .where(eq(articles.featured, true))
    .orderBy(desc(articles.createdAt))
    .limit(limit);
}

export async function getArticlesByCategory(categoryId: number) {
  return db
    .select()
    .from(articles)
    .where(eq(articles.categoryId, categoryId))
    .orderBy(desc(articles.createdAt));
}

export async function getArticleBySlug(slug: string) {
  const result = await db
    .select()
    .from(articles)
    .where(eq(articles.slug, slug))
    .limit(1);
  return result[0] || null;
}

// Recipe images helpers
export async function getImagesByRecipe(recipeId: number) {
  return db
    .select()
    .from(recipeImages)
    .where(eq(recipeImages.recipeId, recipeId))
    .orderBy(asc(recipeImages.sortOrder));
}

// Increment view count
export async function incrementRecipeViews(id: number) {
  await db
    .update(recipes)
    .set({ viewCount: sql`${recipes.viewCount} + 1` })
    .where(eq(recipes.id, id));
}

export async function incrementArticleViews(id: number) {
  await db
    .update(articles)
    .set({ viewCount: sql`${articles.viewCount} + 1` })
    .where(eq(articles.id, id));
}
