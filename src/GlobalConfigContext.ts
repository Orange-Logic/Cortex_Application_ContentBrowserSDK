import { createContext } from 'react';

import { TableColumn, type AutoSelectFormat, type TableRowActionPosition } from '@/types/content-browser';

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

export type CtaTextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';

export type GlobalConfigContextType = {
  allowedExtensions?: string[];
  allowedFolders?: string[];
  availableDocTypes?: string[];
  availableRepresentativeSubtypes?: string[];
  ctaText: string;
  ctaTextTransform?: CtaTextTransform;
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
  simplePick: boolean;
  allowFavorites: boolean;
  allowPin: boolean;
  allowFormatDialogPin?: boolean;
  defaultGridView: string;
  autoSelectFormat: AutoSelectFormat;
  tableColumns?: TableColumn[];
  tableRowActionPosition?: TableRowActionPosition;
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
  showFavoriteFolder: true,
  showVersions: false,
  allowLogout: true,
  allowTracking: true,
  allowProxy: false,
  simplePick: false,
  allowFavorites: false,
  allowPin: false,
  allowFormatDialogPin: false,
  defaultGridView: '',
  autoSelectFormat: false,
  tableColumns: [],
  tableRowActionPosition: 'host-edge',
});
