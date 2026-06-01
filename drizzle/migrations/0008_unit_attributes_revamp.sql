-- Migration: revamp habitable unit attributes.
--
-- The habitable shape (APARTMENT / OFFICE / COMMERCIAL) used to mix counters
-- (balconies, servantRooms) with one boolean (hasLaundryRoom). Product feedback
-- pushed us towards a pure-boolean model for amenities at the unit level:
--
--   - balconies (number)        -> hasBalcony (boolean)
--   - servantRooms (number)     -> removed (not a per-unit signal in our market)
--   - hasLaundryRoom (boolean)  -> removed (handled via shared building amenities)
--
-- And five new boolean signals that better describe what differentiates an
-- apartment in the local market:
--
--   - hasGrill          (parrillero / asador propio)
--   - hasWalkInCloset   (vestidor en el dormitorio principal)
--   - hasMasterSuite    (dormitorio principal con baño privado)
--   - hasDoubleHeight   (loft / penthouse de doble altura)
--
-- The product team confirmed there is no production data worth preserving for
-- typologies and units yet, so the safest and cleanest path is to purge them
-- (and everything that depends on them via FK CASCADE: price history, intents,
-- reservations, leads tied to units, etc.) and let the seed regenerate.

BEGIN;

TRUNCATE TABLE
  "unit",
  "unit_typology"
RESTART IDENTITY CASCADE;

COMMIT;
