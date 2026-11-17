import { AssetLinkFormatPart, toTitleFallback } from '@/types/content-browser';

import { ContentBrowserParameters, GetContentBrowserParametersResponse } from './metadata.types';

/**
 * Auto (suggestion) crop/focus modes. The SDK never offers them: the design system's suggestion
 * request carries no site or token, so it fails cross-origin. Always dropped, on top of whatever
 * `AutoCropMode` lists.
 */
const BUILT_IN_AUTO_MODE_NAMES = ['AzureAI', 'Optical', 'GoogleAI', 'SmartSwatch'];

const PARTS = new Set<string>([
  AssetLinkFormatPart.Proxy,
  AssetLinkFormatPart.Crop,
  AssetLinkFormatPart.Resize,
  AssetLinkFormatPart.Rotate,
  AssetLinkFormatPart.Quality,
  AssetLinkFormatPart.Metadata,
]);

/**
 * Trimmed, non-blank lines of an option-list parameter, or `undefined` when the parameter is
 * unusable: missing, not a string, `N/A` (getparameters' value for a missing path), blank, or
 * `<option>` markup.
 */
function splitParameterLines(raw: unknown): string[] | undefined {
  if (typeof raw !== 'string') {
    return undefined;
  }

  const value = raw.trim();

  if (!value || value === 'N/A' || value.startsWith('<')) {
    return undefined;
  }

  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

/**
 * Lower-cased names of the auto modes: the keys of `AutoCropMode` (`name=Mapping` lines) plus the
 * built-in four.
 */
export function parseAutoModeNames(raw: unknown): string[] {
  const names = (splitParameterLines(raw) ?? []).map((line) => line.split('=')[0].trim());

  return [...new Set([...BUILT_IN_AUTO_MODE_NAMES, ...names].filter(Boolean).map((name) => name.toLowerCase()))];
}

/**
 * `value=label` lines (split at the first `=`, no `=` → value as label) without the auto modes.
 * Blank values and repeated values are skipped. `undefined` when nothing is left, so the dialog
 * falls back to its built-in list.
 */
export function parseModes(raw: unknown, autoModeNames: string[]): Array<{ label: string; value: string }> | undefined {
  const autoNames = new Set(autoModeNames.map((name) => name.toLowerCase()));
  const modes = new Map<string, { label: string; value: string }>();

  splitParameterLines(raw)?.forEach((line) => {
    const separator = line.indexOf('=');
    const value = (separator < 0 ? line : line.slice(0, separator)).trim();
    const label = separator < 0 ? '' : line.slice(separator + 1).trim();

    if (!value || autoNames.has(value.toLowerCase()) || modes.has(value)) {
      return;
    }

    modes.set(value, { label: label || value, value });
  });

  return modes.size ? [...modes.values()] : undefined;
}

/**
 * Panel names, in order. Only the exact names the SDK supports are kept (`dimensions` is a format
 * definition's step, not an embed link's); unknown and repeated names are skipped. `undefined`
 * when nothing is left, so the panel keeps the design system's default panels.
 */
export function parseParts(raw: unknown): AssetLinkFormatPart[] | undefined {
  const parts = [...new Set((splitParameterLines(raw) ?? []).filter((line) => PARTS.has(line)))];

  return parts.length ? parts as AssetLinkFormatPart[] : undefined;
}

/**
 * Maps the raw getparameters response (parameter name → string value) to the SDK's parameters.
 * A missing parameter gets its default, so `toContentBrowserParameters({})` is the full set of
 * defaults.
 */
export function toContentBrowserParameters(raw: Record<string, string>): GetContentBrowserParametersResponse {
  const autoModeNames = parseAutoModeNames(raw[ContentBrowserParameters.AutoCropMode]);

  return {
    ATSEnabled: raw[ContentBrowserParameters.EnableATSInGetLink]?.toLowerCase() === 'true',
    autoExtension: raw[ContentBrowserParameters.ExtensionAuto]?.toLowerCase() ?? '.auto',
    collectionPath: raw[ContentBrowserParameters.CollectionSubtypeCriteria]?.toLowerCase() ?? '',
    cropModes: parseModes(raw[ContentBrowserParameters.AssetLinkFormatCropModes], autoModeNames),
    focusModes: parseModes(raw[ContentBrowserParameters.AssetLinkFormatFocusModes], autoModeNames),
    parts: parseParts(raw[ContentBrowserParameters.AssetLinkFormatParts]),
    supportedExtensions: raw[ContentBrowserParameters.ExtensionsThatSupportTransformationUsingATS]?.split('\n') ?? [],
    supportedRepresentativeSubtypes: raw[ContentBrowserParameters.RepresentativeSupportedDocSubType]?.split('\r\n') ?? [],
    titleFallback: toTitleFallback(raw[ContentBrowserParameters.TitleFallback]),
  };
}
