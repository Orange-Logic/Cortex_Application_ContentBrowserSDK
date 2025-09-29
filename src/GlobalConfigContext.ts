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
  allowedFolders?: string[];
  availableDocTypes?: string[];
  availableRepresentativeSubtypes?: string[];
  ctaText: string;
  displayInfo: ImageCardDisplayInfo;
  lastLocationMode?: boolean;
  persistMode: boolean;
  pluginInfo: PluginInfo;
  isContentBrowserPopedup: boolean;
  showCollections?: boolean;
  showFavoriteFolder?: boolean;
  showVersions?: boolean;
  useSession?: string;
  allowLogout?: boolean;
  allowTracking: boolean;
  allowProxy: boolean;
  allowFavorites: boolean;
  allowPin: boolean;
  defaultGridView: string;
};

export const GlobalConfigContext = createContext<GlobalConfigContextType>({
  allowedExtensions: [],
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
  showCollections: false,
  showFavoriteFolder: false,
  showVersions: false,
  allowLogout: true,
  allowTracking: true,
  allowProxy: false,
  allowFavorites: false,
  allowPin: false,
  defaultGridView: '',
});
