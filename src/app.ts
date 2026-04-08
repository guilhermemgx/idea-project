import Fastify from 'fastify';
import cors from '@fastify/cors';
import { ideasRoutes } from './modules/ideas/ideas.routes.js';
import { AppError } from './shared/errors/app-error.js';

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  });

  app.get('/health', async () => {
    return { status: 'ok' };
  });

  app.register(ideasRoutes, { prefix: '/ideas' });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        message: error.message,
      });
    }

    if (typeof error === 'object' && error !== null && 'validation' in error) {
      return reply.status(400).send({
        message: 'Erro de validação',
        details: (error as any).message,
      });
    }

    app.log.error(error);

    return reply.status(500).send({
      message: 'Erro interno do servidor',
    });
  });

  return app;
}