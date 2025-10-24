const { PrismaClient } = require('@prisma/client');

// Singleton pattern for Prisma Client
// This ensures only one instance is created across the application
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'error', 'warn'],
  });
};

// Use global to store the Prisma instance in development
// This prevents creating multiple instances during hot reloads
const prisma = global.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

module.exports = prisma;

