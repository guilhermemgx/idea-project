import { AppError } from '../../shared/errors/app-error.js';
import { IdeasRepository } from './ideas.repository.js';
import type { CreateIdeaInput, UpdateIdeaInput } from './ideas.types.js';

export class IdeasService {
  constructor(private readonly ideasRepository: IdeasRepository) {}

  async list() {
    return this.ideasRepository.findAll();
  }

  async getById(id: number) {
    const idea = await this.ideasRepository.findById(id);

    if (!idea) {
      throw new AppError('Ideia não encontrada', 404);
    }

    return idea;
  }

  async create(data: CreateIdeaInput) {
    this.validateCreate(data);
    return this.ideasRepository.create({
      ...data,
      author_re: data.author_re.trim(),
      what_can_be_improved: data.what_can_be_improved.trim(),
      current_process: data.current_process.trim(),
      proposed_improvement: data.proposed_improvement.trim(),
      expected_benefit: data.expected_benefit.trim(),
    });
  }

  async update(id: number, data: UpdateIdeaInput) {
    this.validateUpdate(data);

    const updated = await this.ideasRepository.update(id, {
      what_can_be_improved: data.what_can_be_improved.trim(),
      current_process: data.current_process.trim(),
      proposed_improvement: data.proposed_improvement.trim(),
      expected_benefit: data.expected_benefit.trim(),
    });

    if (!updated) {
      throw new AppError('Ideia não encontrada', 404);
    }

    return updated;
  }

  async delete(id: number) {
    const deleted = await this.ideasRepository.delete(id);

    if (!deleted) {
      throw new AppError('Ideia não encontrada', 404);
    }
  }

  private validateCreate(data: CreateIdeaInput) {
    if (!data.author_re?.trim()) {
      throw new AppError('RE do autor é obrigatório');
    }

    if (!data.what_can_be_improved?.trim()) {
      throw new AppError('"O que pode ser melhorado" é obrigatório');
    }

    if (!data.current_process?.trim()) {
      throw new AppError('"Como é feito hoje" é obrigatório');
    }

    if (!data.proposed_improvement?.trim()) {
      throw new AppError('"Como pode ser melhorado" é obrigatório');
    }

    if (!data.expected_benefit?.trim()) {
      throw new AppError('"Qual é o benefício" é obrigatório');
    }

    if (!data.registered_at?.trim()) {
      throw new AppError('Data de registro é obrigatória');
    }
  }

  private validateUpdate(data: UpdateIdeaInput) {
    if (!data.what_can_be_improved?.trim()) {
      throw new AppError('"O que pode ser melhorado" é obrigatório');
    }

    if (!data.current_process?.trim()) {
      throw new AppError('"Como é feito hoje" é obrigatório');
    }

    if (!data.proposed_improvement?.trim()) {
      throw new AppError('"Como pode ser melhorado" é obrigatório');
    }

    if (!data.expected_benefit?.trim()) {
      throw new AppError('"Qual é o benefício" é obrigatório');
    }
  }
}