const TYPES_FACET_KEY = 'Types';

export type AssetExtraFilters = {
  FacetFilters?: Record<string, string[]>;
  SubtypeCriteria?: string[];
};

export function resolveAssetExtraFilters(
  selectedFacets?: Record<string, string[]>,
): AssetExtraFilters {
  if (
    !selectedFacets ||
    Object.keys(selectedFacets).length === 0 ||
    Object.values(selectedFacets).every((v) => !v || v.length === 0)
  ) {
    return {};
  }

  return Object.entries(selectedFacets).reduce<AssetExtraFilters>(
    (acc, [key, values]) => {
      if (!values || values.length === 0) {
        return acc;
      }

      if (key === TYPES_FACET_KEY) {
        acc.SubtypeCriteria = values;

        return acc;
      }

      acc.FacetFilters = { ...(acc.FacetFilters ?? {}), [key]: values };

      return acc;
    },
    {},
  );
}
