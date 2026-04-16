import '@orangelogic/design-system/assets/design-system.css';
import '@orangelogic/design-system/assets/outlined.css';
import '@orangelogic/design-system/css/ol-light.css';
import '@orangelogic/design-system/react-types';

import {
  FC,
  Ref,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components';
import WebFont from 'webfontloader';

import { AppContext, AppContextType } from '@/AppContext';
import AssetsPicker, { AssetsPickerHandle } from '@/view/AssetsPicker';
import '@/components/content-browser-loader';

import { useAppSelector } from './store';
import { accessTokenSelector, authenticatedSelector, siteUrlSelector } from './store/auth/auth.slice';
import Authenticate from './page/Authenticate';

type Props = {
  containerId?: string;
  extraFields?: string[];
  loadExternalFonts?: boolean;
  multiSelect?: boolean;
  /**
   * Call back when we close the app modal.
   * Note: This only applicable when containerId is not defined
   * @returns
   */
  onClose?: () => void;
  onError: AppContextType['onError'];
  onAssetAction: AppContextType['onAssetAction'];
  onAssetSelected: AppContextType['onAssetSelected'];
  onAppAuthUrlCopied: AppContextType['onAppAuthUrlCopied'];
  onImageSelected: AppContextType['onImageSelected'];
  onConnectClicked?: (url: string) => void;
  onTokenChanged?: (token: string) => void;
  onSiteUrlChanged?: (siteUrl: string) => void;
  assetsPickerRef?: Ref<AssetsPickerHandle>;
};

const Container = styled.div<{ open?: boolean }>`
  background-color: var(--cx-color-neutral-0);
  display: ${({ open }) => (open ? 'block' : 'none')};
  height: 100vh;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: var(--cx-z-index-dialog);
`;

export const App: FC<Props> = ({
  extraFields = [],
  containerId,
  loadExternalFonts = true,
  multiSelect,
  onClose,
  onError,
  onAssetAction,
  onAssetSelected,
  onAppAuthUrlCopied,
  onImageSelected,
  onConnectClicked,
  onTokenChanged,
  onSiteUrlChanged,
  assetsPickerRef,
}) => {
  const isAuthenticated = useAppSelector(authenticatedSelector);
  const accessToken = useAppSelector(accessTokenSelector);
  const siteUrl = useAppSelector(siteUrlSelector);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (loadExternalFonts) {
      WebFont.load({
        google: {
          families: [
            'Fira Code:400',
            'Fira Mono:400',
            'Fira Sans:300,400,600',
            'Fira Sans Condensed:300,400,600',
            'Fira Sans Extra Condensed:300,400,600',
          ],
        },
      });
    } else {
      import('./fonts.css');
    }
  }, [loadExternalFonts]);

  useEffect(() => {
    if (onTokenChanged) {
      onTokenChanged(accessToken ?? '');
    }
  }, [accessToken, onTokenChanged]);

  useEffect(() => {
    if (onSiteUrlChanged) {
      onSiteUrlChanged(siteUrl ?? '');
    }
  }, [siteUrl, onSiteUrlChanged]);

  const handleClose = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  const contextValue = useMemo(
    () => ({
      extraFields,
      onAssetAction,
      onAssetSelected,
      onAppAuthUrlCopied,
      onImageSelected,
      onError,
      onClose: handleClose,
      onConnectClicked,
    }),
    [
      extraFields,
      onAssetAction,
      onAssetSelected,
      onAppAuthUrlCopied,
      onImageSelected,
      onError,
      handleClose,
      onConnectClicked,
    ],
  );

  let content = <Authenticate />;

  if (isAuthenticated) {
    const assetsPicker = (
      <AssetsPicker
        ref={assetsPickerRef}
        accessToken={accessToken}
        siteUrl={siteUrl}
        multiSelect={multiSelect}
      />
    );

    content = containerId ? assetsPicker : <Container open={open}>{assetsPicker}</Container>;
  }

  return (
    <AppContext.Provider value={contextValue}>
      <Suspense
        fallback={
          <cx-content-browser-loader></cx-content-browser-loader>
        }
      >
        {content}
      </Suspense>
    </AppContext.Provider>
  );
};

export default App;
