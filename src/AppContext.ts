import { createContext } from 'react';
import { GetAssetLinkResponse } from './types/search';

export type AppContextType = {
  extraFields: string[];
  onAssetSelected: (asset: GetAssetLinkResponse[]) => void;
  onImageSelected: (image: GetAssetLinkResponse[]) => void;
  onError: (errorMessage?: string, error?: Error) => void;
  onClose: () => void;
};

export const AppContext = createContext<AppContextType>({
  extraFields: [],
  onAssetSelected: () => { },
  onImageSelected: () => { },
  onError: () => { },
  onClose: () => { },
});
