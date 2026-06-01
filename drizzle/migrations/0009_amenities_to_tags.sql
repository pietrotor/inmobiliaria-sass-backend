-- Migration: collapse fixed-boolean amenities into free-form customTags.
--
-- We removed the 5 hard-coded booleans (hasBalcony, hasGrill, hasWalkInCloset,
-- hasMasterSuite, hasDoubleHeight) from HabitableUnitAttributes. The product
-- decision: a curated catalog at the code level is too rigid — developers
-- want to add anything they consider distinctive (balcón, parrillero,
-- dormitorio con suite, vista panorámica, sala de eventos exclusiva, etc.).
--
-- So all of those features now live as plain strings inside `customTags`.
--
-- This migration:
--   1. For each habitable typology/unit, appends Spanish labels to `customTags`
--      based on which boolean flags were true. Avoids duplicates.
--   2. Strips the obsolete boolean keys from the JSONB document.

BEGIN;

-- ============================================================================
-- helper to append a tag if the boolean is true and the tag is not already in
-- the array. Used as inline expressions via jsonb operators (no PL/pgSQL fn
-- needed thanks to `jsonb_path_query` + `||`).
-- ============================================================================

-- unit_typology.base_attributes
UPDATE "unit_typology"
SET "base_attributes" = (
  ("base_attributes"
    - 'hasBalcony'
    - 'hasGrill'
    - 'hasWalkInCloset'
    - 'hasMasterSuite'
    - 'hasDoubleHeight')
  || jsonb_build_object(
       'customTags',
       (
         SELECT COALESCE(jsonb_agg(DISTINCT tag), '[]'::jsonb)
         FROM (
           SELECT jsonb_array_elements_text(
             COALESCE("base_attributes"->'customTags', '[]'::jsonb)
           ) AS tag
           UNION
           SELECT 'Balcón' WHERE ("base_attributes"->>'hasBalcony')::boolean IS TRUE
           UNION
           SELECT 'Parrillero' WHERE ("base_attributes"->>'hasGrill')::boolean IS TRUE
           UNION
           SELECT 'Vestidor' WHERE ("base_attributes"->>'hasWalkInCloset')::boolean IS TRUE
           UNION
           SELECT 'Suite master' WHERE ("base_attributes"->>'hasMasterSuite')::boolean IS TRUE
           UNION
           SELECT 'Doble altura' WHERE ("base_attributes"->>'hasDoubleHeight')::boolean IS TRUE
         ) tags
       )
     )
)
WHERE "base_attributes" IS NOT NULL
  AND (
       "base_attributes" ? 'hasBalcony'
    OR "base_attributes" ? 'hasGrill'
    OR "base_attributes" ? 'hasWalkInCloset'
    OR "base_attributes" ? 'hasMasterSuite'
    OR "base_attributes" ? 'hasDoubleHeight'
  );

-- unit.attributes
UPDATE "unit"
SET "attributes" = (
  ("attributes"
    - 'hasBalcony'
    - 'hasGrill'
    - 'hasWalkInCloset'
    - 'hasMasterSuite'
    - 'hasDoubleHeight')
  || jsonb_build_object(
       'customTags',
       (
         SELECT COALESCE(jsonb_agg(DISTINCT tag), '[]'::jsonb)
         FROM (
           SELECT jsonb_array_elements_text(
             COALESCE("attributes"->'customTags', '[]'::jsonb)
           ) AS tag
           UNION
           SELECT 'Balcón' WHERE ("attributes"->>'hasBalcony')::boolean IS TRUE
           UNION
           SELECT 'Parrillero' WHERE ("attributes"->>'hasGrill')::boolean IS TRUE
           UNION
           SELECT 'Vestidor' WHERE ("attributes"->>'hasWalkInCloset')::boolean IS TRUE
           UNION
           SELECT 'Suite master' WHERE ("attributes"->>'hasMasterSuite')::boolean IS TRUE
           UNION
           SELECT 'Doble altura' WHERE ("attributes"->>'hasDoubleHeight')::boolean IS TRUE
         ) tags
       )
     )
)
WHERE "attributes" IS NOT NULL
  AND (
       "attributes" ? 'hasBalcony'
    OR "attributes" ? 'hasGrill'
    OR "attributes" ? 'hasWalkInCloset'
    OR "attributes" ? 'hasMasterSuite'
    OR "attributes" ? 'hasDoubleHeight'
  );

COMMIT;
