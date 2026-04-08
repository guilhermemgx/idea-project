import type { FastifyPluginAsync } from 'fastify';
import { IdeasController } from './ideas.controller.js';
import {
  createIdeaBodySchema,
  ideaParamsSchema,
  ideaSchema,
  updateIdeaBodySchema,
} from './ideas.schemas.js';

const controller = new IdeasController();

export const ideasRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    '/',
    {
      schema: {
        response: {
          200: {
            type: 'array',
            items: ideaSchema,
          },
        },
      },
    },
    controller.index.bind(controller),
  );

  app.get(
    '/:id',
    {
      schema: {
        params: ideaParamsSchema,
        response: {
          200: ideaSchema,
        },
      },
    },
    controller.show.bind(controller),
  );

  app.post(
    '/',
    {
      schema: {
        body: createIdeaBodySchema,
        response: {
          201: ideaSchema,
        },
      },
    },
    controller.create.bind(controller),
  );

  app.put(
    '/:id',
    {
      schema: {
        params: ideaParamsSchema,
        body: updateIdeaBodySchema,
        response: {
          200: ideaSchema,
        },
      },
    },
    controller.update.bind(controller),
  );

  app.delete(
    '/:id',
    {
      schema: {
        params: ideaParamsSchema,
        response: {
          204: {
            type: 'null',
          },
        },
      },
    },
    controller.delete.bind(controller),
  );
};