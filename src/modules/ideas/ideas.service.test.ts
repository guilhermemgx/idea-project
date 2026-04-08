import assert from 'node:assert/strict';
import { IdeasService } from './ideas.service.js';
import { AppError } from '../../shared/errors/app-error.js';
import type {
  CreateIdeaInput,
  Idea,
  UpdateIdeaInput,
} from './ideas.types.js';

type MockIdeasRepository = {
  findAll: () => Promise<Idea[]>;
  findById: (id: number) => Promise<Idea | null>;
  create: (data: CreateIdeaInput) => Promise<Idea>;
  update: (id: number, data: UpdateIdeaInput) => Promise<Idea | null>;
  delete: (id: number) => Promise<boolean>;
};

const makeIdea = (): Idea => ({
  id: 1,
  author_re: '12345',
  what_can_be_improved: 'Fluxo atual',
  current_process: 'Processo manual',
  proposed_improvement: 'Automatizar etapa',
  expected_benefit: 'Reduzir tempo',
  registered_at: '2026-04-08',
  created_at: '2026-04-08T10:00:00.000Z',
  updated_at: '2026-04-08T10:00:00.000Z',
});

const makeCreateInput = (): CreateIdeaInput => ({
  author_re: '12345',
  what_can_be_improved: 'Fluxo atual',
  current_process: 'Processo manual',
  proposed_improvement: 'Automatizar etapa',
  expected_benefit: 'Reduzir tempo',
  registered_at: '2026-04-08',
});

const makeUpdateInput = (): UpdateIdeaInput => ({
  what_can_be_improved: 'Fluxo revisado',
  current_process: 'Processo manual',
  proposed_improvement: 'Automatizar etapa',
  expected_benefit: 'Reduzir tempo',
});

const makeRepository = (): MockIdeasRepository => ({
  findAll: async () => [],
  findById: async () => null,
  create: async () => makeIdea(),
  update: async () => null,
  delete: async () => false,
});

const makeService = (repository: MockIdeasRepository) =>
  new IdeasService(repository as never);

const tests: Array<{ name: string; run: () => Promise<void> }> = [];

const test = (name: string, run: () => Promise<void>) => {
  tests.push({ name, run });
};

test('list retorna todas as ideias do repositório', async () => {
  const ideas = [makeIdea()];
  const repository = makeRepository();
  repository.findAll = async () => ideas;

  const service = makeService(repository);

  const result = await service.list();

  assert.deepEqual(result, ideas);
});

test('getById retorna a ideia quando encontrada', async () => {
  const idea = makeIdea();
  const repository = makeRepository();
  repository.findById = async (id) => {
    assert.equal(id, 1);
    return idea;
  };

  const service = makeService(repository);

  const result = await service.getById(1);

  assert.deepEqual(result, idea);
});

test('getById lança AppError 404 quando a ideia não existe', async () => {
  const service = makeService(makeRepository());

  await assert.rejects(
    () => service.getById(99),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.message, 'Ideia não encontrada');
      assert.equal(error.statusCode, 404);
      return true;
    },
  );
});

test('create sanitiza os campos de texto antes de persistir', async () => {
  const repository = makeRepository();
  let receivedData: CreateIdeaInput | undefined;

  repository.create = async (data) => {
    receivedData = data;
    return {
      ...makeIdea(),
      ...data,
    };
  };

  const service = makeService(repository);

  const result = await service.create({
    author_re: ' 12345 ',
    what_can_be_improved: ' Melhorar cadastro ',
    current_process: ' Processo atual ',
    proposed_improvement: ' Automatizar ',
    expected_benefit: ' Ganho operacional ',
    registered_at: '2026-04-08',
  });

  assert.deepEqual(receivedData, {
    author_re: '12345',
    what_can_be_improved: 'Melhorar cadastro',
    current_process: 'Processo atual',
    proposed_improvement: 'Automatizar',
    expected_benefit: 'Ganho operacional',
    registered_at: '2026-04-08',
  });
  assert.equal(result.author_re, '12345');
});

test('create lança erro quando author_re está vazio', async () => {
  const service = makeService(makeRepository());

  await assert.rejects(
    () =>
      service.create({
        ...makeCreateInput(),
        author_re: '   ',
      }),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.message, 'RE do autor é obrigatório');
      assert.equal(error.statusCode, 400);
      return true;
    },
  );
});

test('update sanitiza os campos e retorna a ideia atualizada', async () => {
  const repository = makeRepository();
  let receivedId: number | undefined;
  let receivedData: UpdateIdeaInput | undefined;

  repository.update = async (id, data) => {
    receivedId = id;
    receivedData = data;
    return {
      ...makeIdea(),
      ...data,
    };
  };

  const service = makeService(repository);

  const result = await service.update(7, {
    what_can_be_improved: ' Melhorar cadastro ',
    current_process: ' Processo atual ',
    proposed_improvement: ' Automatizar ',
    expected_benefit: ' Ganho operacional ',
  });

  assert.equal(receivedId, 7);
  assert.deepEqual(receivedData, {
    what_can_be_improved: 'Melhorar cadastro',
    current_process: 'Processo atual',
    proposed_improvement: 'Automatizar',
    expected_benefit: 'Ganho operacional',
  });
  assert.equal(result.id, 1);
});

test('update lança AppError 404 quando a ideia não existe', async () => {
  const repository = makeRepository();
  repository.update = async () => null;

  const service = makeService(repository);

  await assert.rejects(
    () => service.update(42, makeUpdateInput()),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.message, 'Ideia não encontrada');
      assert.equal(error.statusCode, 404);
      return true;
    },
  );
});

test('delete conclui sem erro quando o repositório remove a ideia', async () => {
  const repository = makeRepository();
  let receivedId: number | undefined;
  repository.delete = async (id) => {
    receivedId = id;
    return true;
  };

  const service = makeService(repository);

  await service.delete(5);

  assert.equal(receivedId, 5);
});

test('delete lança AppError 404 quando a ideia não existe', async () => {
  const service = makeService(makeRepository());

  await assert.rejects(
    () => service.delete(11),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.message, 'Ideia não encontrada');
      assert.equal(error.statusCode, 404);
      return true;
    },
  );
});

const run = async () => {
  let failed = 0;

  for (const { name, run } of tests) {
    try {
      await run();
      console.log(`PASS ${name}`);
    } catch (error) {
      failed += 1;
      console.error(`FAIL ${name}`);
      console.error(error);
    }
  }

  if (failed > 0) {
    process.exitCode = 1;
    throw new Error(`${failed} teste(s) falharam`);
  }

  console.log(`${tests.length} teste(s) passaram`);
};

await run();
