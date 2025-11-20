import 'dotenv/config'
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env('NEON_POSTGRES_PRISMA_URL'),
    shadowDatabaseUrl: env('NEON_DATABASE_URL_UNPOOLED')
  },
});
