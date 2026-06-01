import { BadRequestException } from '@nestjs/common';

import { UnitTypology } from '@domain/unit-typology/entities/unit-typology.entity';

interface UnitOverrides {
  priceUSD?: number | null;
  attributes?: Record<string, unknown> | null;
}

interface ResolvedUnit {
  priceUSD: number;
  attributes: Record<string, unknown>;
}

/**
 * Merges a unit's optional overrides with the typology baseline.
 * The unit always inherits its discriminator (type) from the typology.
 * Price falls back to the typology basePriceUsd when not explicitly overridden.
 */
export function resolveUnitFromTypology(
  typology: UnitTypology,
  overrides: UnitOverrides,
): ResolvedUnit {
  const priceUSD = overrides.priceUSD ?? typology.basePriceUsd;

  if (priceUSD === null || priceUSD === undefined) {
    throw new BadRequestException(
      `Cannot create unit: typology '${typology.name}' has no basePriceUsd and the unit did not provide a priceUSD override.`,
    );
  }

  const baseAttributes =
    (typology.baseAttributes as Record<string, unknown>) ?? {};
  const overrideAttributes = overrides.attributes ?? {};

  const attributes: Record<string, unknown> = {
    ...baseAttributes,
    ...overrideAttributes,
    customTags: mergeCustomTags(
      baseAttributes.customTags,
      overrideAttributes.customTags,
    ),
    type: typology.unitType,
  };

  return { priceUSD, attributes };
}

/**
 * Combines typology-level tags with unit-level overrides as a deduplicated
 * union. We treat customTags as additive rather than replace-on-override so a
 * unit always shows the typology promo tags plus any of its own extras.
 */
function mergeCustomTags(base: unknown, override: unknown): string[] {
  const baseTags = sanitizeTags(base);
  const overrideTags = sanitizeTags(override);

  const merged: string[] = [];
  const seen = new Set<string>();
  for (const tag of [...baseTags, ...overrideTags]) {
    const key = tag.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(tag);
  }
  return merged;
}

function sanitizeTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}
