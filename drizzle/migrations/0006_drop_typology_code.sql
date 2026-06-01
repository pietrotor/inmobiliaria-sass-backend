-- Migration: drop unit_typology.code column.
-- The typology code is no longer part of the data model; the human-readable
-- `name` is now the sole identifier presented to users.

BEGIN;

ALTER TABLE "unit_typology"
  DROP CONSTRAINT IF EXISTS "uq_typology_project_code";

ALTER TABLE "unit_typology"
  DROP COLUMN IF EXISTS "code";

COMMIT;
