export const ideaSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    author_re: { type: 'string' },
    what_can_be_improved: { type: 'string' },
    current_process: { type: 'string' },
    proposed_improvement: { type: 'string' },
    expected_benefit: { type: 'string' },
    registered_at: { type: 'string' },
    created_at: { type: 'string' },
    updated_at: { type: 'string' },
  },
};

export const createIdeaBodySchema = {
  type: 'object',
  required: [
    'author_re',
    'what_can_be_improved',
    'current_process',
    'proposed_improvement',
    'expected_benefit',
    'registered_at',
  ],
  properties: {
    author_re: { type: 'string', minLength: 1, maxLength: 20 },
    what_can_be_improved: { type: 'string', minLength: 1 },
    current_process: { type: 'string', minLength: 1 },
    proposed_improvement: { type: 'string', minLength: 1 },
    expected_benefit: { type: 'string', minLength: 1 },
    registered_at: { type: 'string', format: 'date' },
  },
  additionalProperties: false,
};

export const updateIdeaBodySchema = {
  type: 'object',
  required: [
    'what_can_be_improved',
    'current_process',
    'proposed_improvement',
    'expected_benefit',
  ],
  properties: {
    what_can_be_improved: { type: 'string', minLength: 1 },
    current_process: { type: 'string', minLength: 1 },
    proposed_improvement: { type: 'string', minLength: 1 },
    expected_benefit: { type: 'string', minLength: 1 },
  },
  additionalProperties: false,
};

export const ideaParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'integer', minimum: 1 },
  },
  additionalProperties: false,
};