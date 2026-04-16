import { Facet, SortOrder } from '@/types/content-browser';

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
}

export type GetContentBrowserParametersResponse = {
  ATSEnabled: boolean;
  autoExtension: string;
  collectionPath: string;
  supportedExtensions: string[];
  supportedRepresentativeSubtypes: string[];
};
