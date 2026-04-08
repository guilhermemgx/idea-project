import type { FastifyReply, FastifyRequest } from 'fastify';
import { IdeasRepository } from './ideas.repository.js';
import { IdeasService } from './ideas.service.js';
import type { CreateIdeaInput, UpdateIdeaInput } from './ideas.types.js';

type IdParams = {
  id: number;
};

const repository = new IdeasRepository();
const service = new IdeasService(repository);

export class IdeasController {
  async index(_request: FastifyRequest, reply: FastifyReply) {
    const ideas = await service.list();
    return reply.status(200).send(ideas);
  }

  async show(
    request: FastifyRequest<{ Params: IdParams }>,
    reply: FastifyReply,
  ) {
    const idea = await service.getById(Number(request.params.id));
    return reply.status(200).send(idea);
  }

  async create(
    request: FastifyRequest<{ Body: CreateIdeaInput }>,
    reply: FastifyReply,
  ) {
    const idea = await service.create(request.body);
    return reply.status(201).send(idea);
  }

  async update(
    request: FastifyRequest<{ Params: IdParams; Body: UpdateIdeaInput }>,
    reply: FastifyReply,
  ) {
    const idea = await service.update(Number(request.params.id), request.body);
    return reply.status(200).send(idea);
  }

  async delete(
    request: FastifyRequest<{ Params: IdParams }>,
    reply: FastifyReply,
  ) {
    await service.delete(Number(request.params.id));
    return reply.status(204).send();
  }
}