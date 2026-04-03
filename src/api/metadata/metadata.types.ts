import { Facet, SortOrder } from "@/types/dam-view";

export type GetSearchableFieldListRequest = {
  TableName: string;
};

export type GetSearchableFieldListRawResponse = {
  listFields: Array<{ text: string; value: string }>;
};

export type GetSearchableFieldListResponse = {
  data: Array<{
    label: string;
    value: string;
  }>;
  hasMore: boolean;
};

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
