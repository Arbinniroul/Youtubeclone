import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Throw an error if DATABASE_URL is missing
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing in .env.local');
}

export default defineConfig({
  schema: './src/db/schema.ts', // Path to your schema file
  out: './drizzle', // Output directory for migrations
  dialect: 'postgresql', // Database dialect
  dbCredentials: {
    url: process.env.DATABASE_URL, // Database connection URL
  },
});