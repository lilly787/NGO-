import { PrismaClient } from "@prisma/client";
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Add connection_timeout so Neon's paused DB fails fast (5s) instead of hanging
const connectionUrl = process.env.DATABASE_URL
  ? process.env.DATABASE_URL.includes("connect_timeout")
    ? process.env.DATABASE_URL
    : `${process.env.DATABASE_URL}&connect_timeout=5`
  : undefined;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: connectionUrl,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

