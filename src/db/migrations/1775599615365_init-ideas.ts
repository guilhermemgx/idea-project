import { MigrationBuilder } from 'node-pg-migrate';

export const up = (pgm: MigrationBuilder) => {
  pgm.createTable('ideas', {
    id: 'bigserial',
    author_re: { type: 'varchar(20)', notNull: true },
    what_can_be_improved: { type: 'text', notNull: true },
    current_process: { type: 'text', notNull: true },
    proposed_improvement: { type: 'text', notNull: true },
    expected_benefit: { type: 'text', notNull: true },
    registered_at: { type: 'date', notNull: true },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.sql(`
    ALTER TABLE ideas
      ADD CONSTRAINT ideas_author_re_not_blank
        CHECK (BTRIM(author_re) <> ''),
      ADD CONSTRAINT ideas_what_not_blank
        CHECK (BTRIM(what_can_be_improved) <> ''),
      ADD CONSTRAINT ideas_current_not_blank
        CHECK (BTRIM(current_process) <> ''),
      ADD CONSTRAINT ideas_proposed_not_blank
        CHECK (BTRIM(proposed_improvement) <> ''),
      ADD CONSTRAINT ideas_benefit_not_blank
        CHECK (BTRIM(expected_benefit) <> '');
  `);

  pgm.createIndex('ideas', 'author_re');
  pgm.createIndex('ideas', 'registered_at');

  pgm.sql(`
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  pgm.sql(`
    CREATE TRIGGER trg_ideas_set_updated_at
    BEFORE UPDATE ON ideas
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
  `);
};

export const down = (pgm: MigrationBuilder) => {
  pgm.sql(`
    DROP TRIGGER IF EXISTS trg_ideas_set_updated_at ON ideas;
  `);

  pgm.sql(`
    DROP FUNCTION IF EXISTS set_updated_at();
  `);

  pgm.dropTable('ideas', { ifExists: true, cascade: true });
};