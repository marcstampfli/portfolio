import { PrismaClient } from ".prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const client = new PrismaClient();
const prisma = global.prisma || client;

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export { prisma };
