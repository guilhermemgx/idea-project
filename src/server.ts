import { buildApp } from './app.js';
import { env } from './config/env.js';
import { pool } from './db/pool.js';

const start = async () => {
  try {
    const app = await buildApp();

    await pool.query('SELECT 1');
    await app.listen({ port: env.port, host: '0.0.0.0' });

    console.log(`Servidor rodando na porta ${env.port}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();