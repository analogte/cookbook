import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { db } from "../db";
import { headers } from "next/headers";
import { verifyToken } from "@/lib/auth";

// Admin credentials from environment
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export const createTRPCContext = async () => {
  // Get authorization header
  const headersList = await headers();
  const authorization = headersList.get("authorization");

  let isAuthenticated = false;

  // Check Authorization Header (Basic Auth) - for API/script access
  if (authorization) {
    const base64Credentials = authorization.split(" ")[1];
    if (base64Credentials) {
      try {
        const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
        const [username, password] = credentials.split(":");
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
          isAuthenticated = true;
        }
      } catch {
        // Ignore malformed credentials
      }
    }
  }

  // Check Cookie (JWT Session Auth) - for browser access
  if (!isAuthenticated) {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get("admin_session");

      if (sessionCookie?.value) {
        // Verify JWT token
        const payload = await verifyToken(sessionCookie.value);
        if (payload) {
          isAuthenticated = true;
        }
      }
    } catch {
      // Ignore errors (e.g. running in context where cookies() isn't available)
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
