import { createContext } from 'react';
import { GetAssetLinkResponse } from './types/search';

export interface AppContextType {
  onImageSelected: (image: GetAssetLinkResponse[]) => void;
  onError: (errorMessage?: string, error?: Error) => void;
  onClose: () => void;
}

export const AppContext = createContext<AppContextType>({
  onImageSelected: () => { },
  onError: () => { },
  onClose: () => { },
});
