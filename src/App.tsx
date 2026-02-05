import '@orangelogic/design-system/assets/design-system.css';
import '@orangelogic/design-system/assets/outlined.css';
import '@orangelogic/design-system/components/alert';
import '@orangelogic/design-system/components/avatar';
import '@orangelogic/design-system/components/badge';
import '@orangelogic/design-system/components/button';
import '@orangelogic/design-system/components/button-group';
import '@orangelogic/design-system/components/card';
import '@orangelogic/design-system/components/checkbox';
import '@orangelogic/design-system/components/copy-button';
import '@orangelogic/design-system/components/details';
import '@orangelogic/design-system/components/dialog';
import '@orangelogic/design-system/components/divider';
import '@orangelogic/design-system/components/drawer';
import '@orangelogic/design-system/components/dropdown';
import '@orangelogic/design-system/components/grid';
import '@orangelogic/design-system/components/grid-item';
import '@orangelogic/design-system/components/icon';
import '@orangelogic/design-system/components/icon-button';
import '@orangelogic/design-system/components/input';
import '@orangelogic/design-system/components/input-group';
import '@orangelogic/design-system/components/line-clamp';
import '@orangelogic/design-system/components/menu';
import '@orangelogic/design-system/components/menu-item';
import '@orangelogic/design-system/components/menu-label';
import '@orangelogic/design-system/components/option';
import '@orangelogic/design-system/components/progress-bar';
import '@orangelogic/design-system/components/resize-observer';
import '@orangelogic/design-system/components/select';
import '@orangelogic/design-system/components/skeleton';
import '@orangelogic/design-system/components/space';
import '@orangelogic/design-system/components/spinner';
import '@orangelogic/design-system/components/switch';
import '@orangelogic/design-system/components/tag';
import '@orangelogic/design-system/components/tooltip';
import '@orangelogic/design-system/components/tree';
import '@orangelogic/design-system/components/tree-item';
import '@orangelogic/design-system/components/typography';
import '@orangelogic/design-system/css/ol-light.css';
import '@orangelogic/design-system/react-types';

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
            'Fira Code:400',
            'Fira Mono:400',
            'Fira Sans:300,400,600',
            'Fira Sans Condensed:300,400,600',
            'Fira Sans Extra Condensed:300,400,600',
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
