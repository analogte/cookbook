import "server-only";
import { createCaller, appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { cache } from "react";

const createContext = cache(async () => {
  return createTRPCContext();
});

export const api = createCaller(createContext);
