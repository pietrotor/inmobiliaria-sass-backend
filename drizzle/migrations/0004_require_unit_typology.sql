-- Migration: enforce that every unit belongs to a typology.
-- Purges orphan units (typology_id IS NULL), recalculates project.total_units,
-- changes the FK ON DELETE behavior from SET NULL to RESTRICT and makes
-- the column NOT NULL.

BEGIN;

DELETE FROM "unit" WHERE "typology_id" IS NULL;

UPDATE "project" p
SET "total_units" = COALESCE(sub.cnt, 0)
FROM (
  SELECT "project_id", COUNT(*)::int AS cnt
  FROM "unit"
  GROUP BY "project_id"
) AS sub
WHERE p."id" = sub."project_id";

UPDATE "project"
SET "total_units" = 0
WHERE "id" NOT IN (SELECT DISTINCT "project_id" FROM "unit");

ALTER TABLE "unit"
  DROP CONSTRAINT IF EXISTS "unit_typology_id_unit_typology_id_fk";

ALTER TABLE "unit"
  ALTER COLUMN "typology_id" SET NOT NULL;

ALTER TABLE "unit"
  ADD CONSTRAINT "unit_typology_id_unit_typology_id_fk"
  FOREIGN KEY ("typology_id") REFERENCES "unit_typology"("id") ON DELETE RESTRICT;

COMMIT;
