import { createContext } from 'react';
import { GetAssetLinkResponse } from './types/search';

export interface CustomStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl?: number): void;
  delete(key: string): void;
}

export type AppContextType = {
  extraFields: string[];
  getPinnedState?: (recordId: string) => boolean;
  onAssetAction: (action: string, recordID: string) => void;
  onAssetSelected: (asset: GetAssetLinkResponse[]) => void | Promise<void>;
  onAppAuthUrlCopied: (url: string) => Promise<void>;
  onImageSelected: (image: GetAssetLinkResponse[]) => void;
  onPinAsset?: (recordID: string) => Promise<void>;
  onError: (errorMessage?: string, error?: Error) => void;
  onClose: () => void;
  onConnectClicked?: (url: string) => void;
  onTokenChanged?: (token: string) => void;
  onUnpinAsset?: (recordID: string) => Promise<void>;
  customStorage?: CustomStorage;
};

export const AppContext = createContext<AppContextType>({
  extraFields: [],
  getPinnedState: () => false,
  onAssetAction: () => { },
  onAssetSelected: () => { },
  onAppAuthUrlCopied: async () => { },
  onImageSelected: () => { },
  onPinAsset: async () => { },
  onError: () => { },
  onClose: () => { },
  onConnectClicked: () => { },
  onUnpinAsset: async () => { },
});
