import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { db } from "../db";
import { headers } from "next/headers";

// Admin credentials from environment
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export const createTRPCContext = async () => {
  // Get authorization header
  const headersList = await headers();
  const authorization = headersList.get("authorization");

  let isAuthenticated = false;

  if (authorization) {
    // Basic auth: "Basic base64(username:password)"
    const base64Credentials = authorization.split(" ")[1];
    if (base64Credentials) {
      const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
      const [username, password] = credentials.split(":");
      isAuthenticated = username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
    }
  }

  return {
    db,
    isAuthenticated,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

// Middleware to check authentication
const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  if (!ctx.isAuthenticated) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in as admin to perform this action",
    });
  }
  return next({
    ctx: {
      ...ctx,
      isAuthenticated: true,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);
export const createCallerFactory = t.createCallerFactory;
