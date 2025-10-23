import '@orangelogic-private/design-system/assets/design-system.css';
import '@orangelogic-private/design-system/assets/outlined.css';
import '@orangelogic-private/design-system/components/alert';
import '@orangelogic-private/design-system/components/avatar';
import '@orangelogic-private/design-system/components/badge';
import '@orangelogic-private/design-system/components/button';
import '@orangelogic-private/design-system/components/button-group';
import '@orangelogic-private/design-system/components/card';
import '@orangelogic-private/design-system/components/checkbox';
import '@orangelogic-private/design-system/components/copy-button';
import '@orangelogic-private/design-system/components/details';
import '@orangelogic-private/design-system/components/dialog';
import '@orangelogic-private/design-system/components/divider';
import '@orangelogic-private/design-system/components/drawer';
import '@orangelogic-private/design-system/components/dropdown';
import '@orangelogic-private/design-system/components/grid';
import '@orangelogic-private/design-system/components/grid-item';
import '@orangelogic-private/design-system/components/icon';
import '@orangelogic-private/design-system/components/icon-button';
import '@orangelogic-private/design-system/components/input';
import '@orangelogic-private/design-system/components/input-group';
import '@orangelogic-private/design-system/components/line-clamp';
import '@orangelogic-private/design-system/components/menu';
import '@orangelogic-private/design-system/components/menu-item';
import '@orangelogic-private/design-system/components/menu-label';
import '@orangelogic-private/design-system/components/option';
import '@orangelogic-private/design-system/components/progress-bar';
import '@orangelogic-private/design-system/components/resize-observer';
import '@orangelogic-private/design-system/components/select';
import '@orangelogic-private/design-system/components/skeleton';
import '@orangelogic-private/design-system/components/space';
import '@orangelogic-private/design-system/components/spinner';
import '@orangelogic-private/design-system/components/switch';
import '@orangelogic-private/design-system/components/tag';
import '@orangelogic-private/design-system/components/tooltip';
import '@orangelogic-private/design-system/components/tree';
import '@orangelogic-private/design-system/components/tree-item';
import '@orangelogic-private/design-system/components/typography';
import '@orangelogic-private/design-system/css/ol-light.css';
import '@orangelogic-private/design-system/react-types';

import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import WebFont from 'webfontloader';

import { AppContext, AppContextType } from '@/AppContext';
import AssetsPicker from '@/view/AssetsPicker';

import { useAppSelector } from './store';
import { accessTokenSelector, siteUrlSelector } from './store/auth/auth.slice';

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
}) => {
  const accessToken = useAppSelector(accessTokenSelector);
  const siteUrl = useAppSelector(siteUrlSelector);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (loadExternalFonts) {
      WebFont.load({
        google: {
          families: [
            'Fira Code',
            'Fira Mono',
            'Fira Sans',
            'Fira Sans Condensed',
            'Fira Sans Extra Condensed',
          ],
        },
      });
    } else {
      // @ts-expect-error
      import('./fonts.css');
    }
  }, [loadExternalFonts]);

  useEffect(() => {
    if (onTokenChanged) {
      onTokenChanged(accessToken ?? '');
    }
  }, [accessToken, onTokenChanged]);

  useEffect(() => {
    if (onSiteUrlChanged && siteUrl) {
      onSiteUrlChanged(siteUrl);
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

  return (
    <AppContext.Provider value={contextValue}>
      {containerId ? (
        <AssetsPicker multiSelect={multiSelect} />
      ) : (
        <Container open={open}>
          <AssetsPicker multiSelect={multiSelect} />
        </Container>
      )}
    </AppContext.Provider>
  );
};

export default App;
