import { createContext } from 'react';

export interface SelectProxyContextType {
  openSelectProxyModal: () => void;
  isModalOpen: boolean;
}

export const SelectProxyContext = createContext<SelectProxyContextType>({
  openSelectProxyModal: () => { },
  isModalOpen: false,
});