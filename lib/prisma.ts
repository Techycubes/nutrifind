import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined;
}

const globalForPrisma = globalThis as unknown as { __prisma__?: PrismaClient };

const prisma = globalForPrisma.__prisma__ ?? new PrismaClient();
if (!globalForPrisma.__prisma__) globalForPrisma.__prisma__ = prisma;

export default prisma;
