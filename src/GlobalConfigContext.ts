import { createContext } from 'react';

export type ImageCardDisplayInfo = {
  title?: boolean,
  dimension?: boolean,
  fileSize?: boolean,
  tags?: boolean,
};

export type PluginInfo = {
  publicApplicationName?: string,
  pluginName?: string,
};

export type GlobalConfigContextType = {
  allowedExtensions?: string[];
  availableDocTypes?: string[];
  availableRepresentativeSubtypes?: string[];
  ctaText: string;
  displayInfo: ImageCardDisplayInfo;
  lastLocationMode?: boolean;
  persistMode: boolean;
  pluginInfo: PluginInfo;
  isContentBrowserPopedup: boolean;
  searchInDrive: boolean;
  showCollections?: boolean;
  useSession?: string;
  allowTracking: boolean;
};

export const GlobalConfigContext = createContext<GlobalConfigContextType>({
  allowedExtensions: ['*'],
  availableDocTypes: [],
  availableRepresentativeSubtypes: [],
  ctaText: 'Insert',
  persistMode: false,
  displayInfo: {
    title: true,
    dimension: true,
    fileSize: false,
    tags: false,
  },
  pluginInfo: {},
  isContentBrowserPopedup: false,
  searchInDrive: false,
  showCollections: false,
  allowTracking: true,
});
