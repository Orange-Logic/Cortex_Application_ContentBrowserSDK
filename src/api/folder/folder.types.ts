/**
 * Enum defining field names used in folder/document API responses.
 * These fields are used for mapping raw API data to typed folder properties.
 */
export enum FolderField {
  /** Path to the document/folder in the Cortex system */
  CortexPath = 'Document.CortexPath',
  /** Document type */
  DocType = 'CoreField.DocType',
  /** Indicates whether the folder has child items that can be browsed */
  HasBrowserChildren = 'Document.HasBrowserChildren',
  /** Representative image of the folder */
  RepresentativeAssetId = 'Document.DocumentDirectRepresentativeRID',
  /** Title field with fallback logic for display purposes */
  TitleWithFallback = 'CoreField.TitleWithFallback',
  rawDocSubtype = 'Document.RawDocSubType',
}
