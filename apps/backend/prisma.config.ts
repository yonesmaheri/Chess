import { config as loadEnv } from 'dotenv';
import { resolve } from 'node:path';
import { defineConfig, env } from 'prisma/config';

const currentDir = __dirname;

loadEnv({ path: resolve(currentDir, '.env.local') });
loadEnv({ path: resolve(currentDir, '.env') });
loadEnv({ path: resolve(currentDir, '..', '..', '.env.local') });
loadEnv({ path: resolve(currentDir, '..', '..', '.env') });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
