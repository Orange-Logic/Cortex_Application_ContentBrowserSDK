import { createContext } from 'react';
import { GetAssetLinkResponse } from './types/search';
export type ImageCardDisplayInfo = {
  title?: boolean,
  dimension?: boolean,
  fileSize?: boolean,
  tags?: boolean,
};

export interface AppContextType {
  onImageSelected: (image: GetAssetLinkResponse[]) => void;
  onError: (errorMessage?: string, error?: Error) => void;
  displayInfo: ImageCardDisplayInfo;
}

export const AppContext = createContext<AppContextType>({
  onImageSelected: () => { },
  onError: () => { },
  displayInfo: {
    title: true,
    dimension: true,
    fileSize: true,
    tags: true,
  },
});
