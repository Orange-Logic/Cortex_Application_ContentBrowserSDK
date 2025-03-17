import { createContext } from 'react';

export type ImageCardDisplayInfo = {
  title?: boolean,
  dimension?: boolean,
  fileSize?: boolean,
  tags?: boolean,
};

export type PluginInfo = {
  pluginName?: string,
  pluginShortName?: string,
};

export type GlobalConfigContextType = {
  availableDocTypes?: string[];
  availableRepresentativeSubtypes?: string[];
  ctaText: string;
  displayInfo: ImageCardDisplayInfo;
  persistMode: boolean;
  pluginInfo: PluginInfo;
  isGABPopedup: boolean;
  searchInDrive: boolean;
  showCollections?: boolean;
};

export const GlobalConfigContext = createContext<GlobalConfigContextType>({
  availableDocTypes: [],
  availableRepresentativeSubtypes: [],
  ctaText: 'Insert',
  persistMode: false,
  displayInfo: {
    title: true,
    dimension: true,
    fileSize: true,
    tags: true,
  },
  pluginInfo: {},
  isGABPopedup: false,
  searchInDrive: false,
  showCollections: false,
});
