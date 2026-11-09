import { Facet, SortOrder, type TitleFallback } from '@/types/content-browser';

export type GetSortOrdersResponse = Record<string, SortOrder[]>;

export type GetAvailableFacetsResponse = Array<Facet['facetDetails']>;

export enum ContentBrowserParameters {
  CollectionSubtypeCriteria = 'CollectionSubtypeCriteria',
  EnableATSInGetLink = 'EnableATSInGetLink',
  ExtensionAuto = 'ExtensionAuto',
  ExtensionsEmbeddableInWeb = 'ExtensionsEmbeddableInWeb',
  ExtensionsThatSupportTransformationUsingATS = 'ExtensionsThatSupportTransformationUsingATS',
  RepresentativeSupportedDocSubType = 'RepresentativeSupportedDocSubType',
  SupportDocTypes = 'SupportDocTypes',
  SupportedDocSubTypesV2 = 'SupportedDocSubTypesV2',
  TitleFallback = 'TitleFallback',
}

export type GetContentBrowserParametersResponse = {
  ATSEnabled: boolean;
  autoExtension: string;
  collectionPath: string;
  supportedExtensions: string[];
  supportedRepresentativeSubtypes: string[];
  titleFallback: TitleFallback;
};
