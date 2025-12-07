import { router, createCallerFactory } from "./trpc";
import { categoriesRouter } from "./routers/categories";
import { recipesRouter } from "./routers/recipes";
import { tagsRouter } from "./routers/tags";
import { articlesRouter } from "./routers/articles";
import { adminRouter } from "./routers/admin";

export const appRouter = router({
  categories: categoriesRouter,
  recipes: recipesRouter,
  tags: tagsRouter,
  articles: articlesRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
