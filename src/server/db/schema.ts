import { sql } from "drizzle-orm";
import { text, integer, sqliteTable, real } from "drizzle-orm/sqlite-core";

// Categories table
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon"), // emoji or icon name
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").default(0),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Recipes table
export const recipes = sqliteTable("recipes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categoryId: integer("category_id").references(() => categories.id),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  prepTime: integer("prep_time"), // in minutes
  cookTime: integer("cook_time"), // in minutes
  servings: integer("servings"),
  difficulty: text("difficulty"), // easy, medium, hard
  tips: text("tips"),
  videoUrl: text("video_url"),
  featured: integer("featured", { mode: "boolean" }).default(false),
  viewCount: integer("view_count").default(0),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Ingredients table
export const ingredients = sqliteTable("ingredients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  recipeId: integer("recipe_id")
    .references(() => recipes.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  amount: real("amount"),
  unit: text("unit"),
  notes: text("notes"),
  groupName: text("group_name"), // for grouping ingredients (e.g., "For the sauce")
  sortOrder: integer("sort_order").default(0),
});

// Steps table
export const steps = sqliteTable("steps", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  recipeId: integer("recipe_id")
    .references(() => recipes.id, { onDelete: "cascade" })
    .notNull(),
  stepNumber: integer("step_number").notNull(),
  instruction: text("instruction").notNull(),
  imageUrl: text("image_url"),
  duration: integer("duration"), // in minutes
  tips: text("tips"),
});

// Tags table
export const tags = sqliteTable("tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  color: text("color"), // hex color for display
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Recipe Tags (junction table)
export const recipeTags = sqliteTable("recipe_tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  recipeId: integer("recipe_id")
    .references(() => recipes.id, { onDelete: "cascade" })
    .notNull(),
  tagId: integer("tag_id")
    .references(() => tags.id, { onDelete: "cascade" })
    .notNull(),
});

// Articles table
export const articles = sqliteTable("articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categoryId: integer("category_id").references(() => categories.id),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  author: text("author"),
  featured: integer("featured", { mode: "boolean" }).default(false),
  viewCount: integer("view_count").default(0),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Gallery images for recipes
export const recipeImages = sqliteTable("recipe_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  recipeId: integer("recipe_id")
    .references(() => recipes.id, { onDelete: "cascade" })
    .notNull(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  sortOrder: integer("sort_order").default(0),
});

// Type exports
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Recipe = typeof recipes.$inferSelect;
export type NewRecipe = typeof recipes.$inferInsert;
export type Ingredient = typeof ingredients.$inferSelect;
export type NewIngredient = typeof ingredients.$inferInsert;
export type Step = typeof steps.$inferSelect;
export type NewStep = typeof steps.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type RecipeTag = typeof recipeTags.$inferSelect;
export type NewRecipeTag = typeof recipeTags.$inferInsert;
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type RecipeImage = typeof recipeImages.$inferSelect;
export type NewRecipeImage = typeof recipeImages.$inferInsert;
