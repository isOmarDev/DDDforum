import path from 'path';
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

const PRISMA_DIR = path.join(__dirname, 'src/shared/database/prisma');

export default defineConfig({
  schema: path.join(PRISMA_DIR, 'schema.prisma'),
  migrations: {
    path: path.join(PRISMA_DIR, 'migrations'),
    seed: `tsx ${path.join(PRISMA_DIR, 'seed.ts')}`,
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
