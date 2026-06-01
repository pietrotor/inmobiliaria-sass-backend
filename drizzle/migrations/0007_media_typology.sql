-- Adds TYPOLOGY value to the entity_type enum so media (plans, renders, brochures...)
-- can be attached to unit typologies and inherited by their units.
ALTER TYPE entity_type ADD VALUE IF NOT EXISTS 'TYPOLOGY' AFTER 'UNIT';
