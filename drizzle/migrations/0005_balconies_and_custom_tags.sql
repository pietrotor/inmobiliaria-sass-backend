-- Migration: refactor habitable booleans into counters and introduce customTags.
--
-- 1. unit.attributes / unit_typology.base_attributes:
--    - hasBalcony (boolean)     -> balconies (int)
--    - hasServantRoom (boolean) -> servantRooms (int)
--    - ensure customTags (string[]) exists
--
-- hasLaundryRoom, hasGarden, hasGarage, hasTerrace, isCovered remain boolean.
-- The "type" discriminator and all other fields are preserved.

BEGIN;

-- ============================================================================
-- unit.attributes
-- ============================================================================

UPDATE "unit"
SET "attributes" = (
  ("attributes" - 'hasBalcony')
  || jsonb_build_object(
       'balconies',
       CASE
         WHEN ("attributes"->>'hasBalcony')::boolean THEN 1
         ELSE 0
       END
     )
)
WHERE "attributes" ? 'hasBalcony';

UPDATE "unit"
SET "attributes" = (
  ("attributes" - 'hasServantRoom')
  || jsonb_build_object(
       'servantRooms',
       CASE
         WHEN ("attributes"->>'hasServantRoom')::boolean THEN 1
         ELSE 0
       END
     )
)
WHERE "attributes" ? 'hasServantRoom';

UPDATE "unit"
SET "attributes" = "attributes" || '{"customTags": []}'::jsonb
WHERE "attributes" IS NULL OR NOT ("attributes" ? 'customTags');

-- ============================================================================
-- unit_typology.base_attributes
-- ============================================================================

UPDATE "unit_typology"
SET "base_attributes" = (
  ("base_attributes" - 'hasBalcony')
  || jsonb_build_object(
       'balconies',
       CASE
         WHEN ("base_attributes"->>'hasBalcony')::boolean THEN 1
         ELSE 0
       END
     )
)
WHERE "base_attributes" ? 'hasBalcony';

UPDATE "unit_typology"
SET "base_attributes" = (
  ("base_attributes" - 'hasServantRoom')
  || jsonb_build_object(
       'servantRooms',
       CASE
         WHEN ("base_attributes"->>'hasServantRoom')::boolean THEN 1
         ELSE 0
       END
     )
)
WHERE "base_attributes" ? 'hasServantRoom';

UPDATE "unit_typology"
SET "base_attributes" = COALESCE("base_attributes", '{}'::jsonb) || '{"customTags": []}'::jsonb
WHERE "base_attributes" IS NULL OR NOT ("base_attributes" ? 'customTags');

COMMIT;
