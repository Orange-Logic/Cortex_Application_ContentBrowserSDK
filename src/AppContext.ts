import { createContext } from 'react';
import { GetAssetLinkResponse } from './types/search';

export interface CustomStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl?: number): void;
  delete(key: string): void;
}

export type AppContextType = {
  extraFields: string[];
  onAssetAction: (action: string, recordID: string) => void;
  onAssetSelected: (asset: GetAssetLinkResponse[]) => void | Promise<void>;
  onImageSelected: (image: GetAssetLinkResponse[]) => void;
  onError: (errorMessage?: string, error?: Error) => void;
  onClose: () => void;
  onConnectClicked?: (url: string) => void;
  onTokenChanged?: (token: string) => void;
  customStorage?: CustomStorage;
};

export const AppContext = createContext<AppContextType>({
  extraFields: [],
  onAssetAction: () => { },
  onAssetSelected: () => { },
  onImageSelected: () => { },
  onError: () => { },
  onClose: () => { },
  onConnectClicked: () => { },
});
