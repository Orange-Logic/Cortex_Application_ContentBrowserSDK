import {
  AssetLinkFormatPart, CropMode, Facet, FocusMode, SortOrder,
} from '@/types/content-browser';

export type GetSortOrdersResponse = Record<string, SortOrder[]>;

export type GetAvailableFacetsResponse = Array<Facet['facetDetails']>;

export enum ContentBrowserParameters {
  AssetLinkFormatCropModes = 'AssetLinkFormatCropModes',
  AssetLinkFormatFocusModes = 'AssetLinkFormatFocusModes',
  AssetLinkFormatParts = 'AssetLinkFormatParts',
  AutoCropMode = 'AutoCropMode',
  CollectionSubtypeCriteria = 'CollectionSubtypeCriteria',
  EnableATSInGetLink = 'EnableATSInGetLink',
  ExtensionAuto = 'ExtensionAuto',
  ExtensionsEmbeddableInWeb = 'ExtensionsEmbeddableInWeb',
  ExtensionsThatSupportTransformationUsingATS = 'ExtensionsThatSupportTransformationUsingATS',
  RepresentativeSupportedDocSubType = 'RepresentativeSupportedDocSubType',
  SupportDocTypes = 'SupportDocTypes',
  SupportedDocSubTypesV2 = 'SupportedDocSubTypesV2',
}

export type GetContentBrowserParametersResponse = {
  ATSEnabled: boolean;
  autoExtension: string;
  collectionPath: string;
  /** Crop modes for the custom format panel; `undefined` → the dialog's built-in list. */
  cropModes?: CropMode[];
  /** Focus modes for the custom format panel; `undefined` → the dialog's built-in list. */
  focusModes?: FocusMode[];
  /** Panels of the custom format panel, in order; `undefined` → the design system's default panels. */
  parts?: AssetLinkFormatPart[];
  supportedExtensions: string[];
  supportedRepresentativeSubtypes: string[];
};
