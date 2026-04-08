import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL ?? '',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
};

if (!env.databaseUrl) {
  throw new Error('DATABASE_URL não foi definida no .env');
}