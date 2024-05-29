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

export interface GlobalConfigContextType {
  displayInfo: ImageCardDisplayInfo;
  pluginInfo: PluginInfo;
  isGABPopedup: boolean;
}

export const GlobalConfigContext = createContext<GlobalConfigContextType>({
  displayInfo: {
    title: true,
    dimension: true,
    fileSize: true,
    tags: true,
  },
  pluginInfo: {},
  isGABPopedup: false,
});
