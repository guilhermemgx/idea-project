import { pool } from '../../db/pool.js';
import type { CreateIdeaInput, Idea, UpdateIdeaInput } from './ideas.types.js';

export class IdeasRepository {
  async findAll(): Promise<Idea[]> {
    const result = await pool.query<Idea>(
      `
      SELECT
        id,
        author_re,
        what_can_be_improved,
        current_process,
        proposed_improvement,
        expected_benefit,
        registered_at::text,
        created_at::text,
        updated_at::text
      FROM ideas
      ORDER BY id DESC
      `,
    );

    return result.rows;
  }

  async findById(id: number): Promise<Idea | null> {
    const result = await pool.query<Idea>(
      `
      SELECT
        id,
        author_re,
        what_can_be_improved,
        current_process,
        proposed_improvement,
        expected_benefit,
        registered_at::text,
        created_at::text,
        updated_at::text
      FROM ideas
      WHERE id = $1
      `,
      [id],
    );

    return result.rows[0] ?? null;
  }

  async create(data: CreateIdeaInput): Promise<Idea> {
    const result = await pool.query<Idea>(
      `
      INSERT INTO ideas (
        author_re,
        what_can_be_improved,
        current_process,
        proposed_improvement,
        expected_benefit,
        registered_at
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        author_re,
        what_can_be_improved,
        current_process,
        proposed_improvement,
        expected_benefit,
        registered_at::text,
        created_at::text,
        updated_at::text
      `,
      [
        data.author_re,
        data.what_can_be_improved,
        data.current_process,
        data.proposed_improvement,
        data.expected_benefit,
        data.registered_at,
      ],
    );

    const idea = result.rows[0];

    if (!idea) {
      throw new Error('Erro ao criar ideia');
    }

    return idea;
  }
  
  async update(id: number, data: UpdateIdeaInput): Promise<Idea | null> {
    const result = await pool.query<Idea>(
      `
      UPDATE ideas
      SET
        what_can_be_improved = $2,
        current_process = $3,
        proposed_improvement = $4,
        expected_benefit = $5
      WHERE id = $1
      RETURNING
        id,
        author_re,
        what_can_be_improved,
        current_process,
        proposed_improvement,
        expected_benefit,
        registered_at::text,
        created_at::text,
        updated_at::text
      `,
      [
        id,
        data.what_can_be_improved,
        data.current_process,
        data.proposed_improvement,
        data.expected_benefit,
      ],
    );

    return result.rows[0] ?? null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await pool.query(
      `
      DELETE FROM ideas
      WHERE id = $1
      `,
      [id],
    );

    return (result.rowCount ?? 0) > 0;
  }
}