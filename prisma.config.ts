import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // Migrate uses this URL. Set DATABASE_URL in .env
    url: process.env.DATABASE_URL!,
  },
});
