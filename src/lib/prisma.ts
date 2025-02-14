import pkg from '@prisma/client';
const { PrismaClient } = pkg;

/**
 * Extend global type to include our database client
 */
declare global {
  var db: undefined | ReturnType<typeof PrismaClient["prototype"]["constructor"]>;
}

/**
 * Create a new PrismaClient instance with environment-specific logging
 */
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });
};

// Initialize client as singleton
const db = globalThis.db ?? prismaClientSingleton();

// Prevent multiple instances during development due to hot reloading
if (process.env.NODE_ENV !== 'production') {
  globalThis.db = db;
}

export { db as prisma };
