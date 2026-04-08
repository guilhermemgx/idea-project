export type Idea = {
  id: number;
  author_re: string;
  what_can_be_improved: string;
  current_process: string;
  proposed_improvement: string;
  expected_benefit: string;
  registered_at: string;
  created_at: string;
  updated_at: string;
};

export type CreateIdeaInput = {
  author_re: string;
  what_can_be_improved: string;
  current_process: string;
  proposed_improvement: string;
  expected_benefit: string;
  registered_at: string;
};

export type UpdateIdeaInput = {
  what_can_be_improved: string;
  current_process: string;
  proposed_improvement: string;
  expected_benefit: string;
};