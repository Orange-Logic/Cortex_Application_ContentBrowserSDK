import './design-system/assets/styles.css';
import './design-system/components/alert';
import './design-system/components/avatar';
import './design-system/components/badge';
import './design-system/components/button';
import './design-system/components/button-group';
import './design-system/components/card';
import './design-system/components/checkbox';
import './design-system/components/details';
import './design-system/components/dialog';
import './design-system/components/divider';
import './design-system/components/drawer';
import './design-system/components/dropdown';
import './design-system/components/icon';
import './design-system/components/icon-button';
import './design-system/components/input';
import './design-system/components/input-group';
import './design-system/components/line-clamp';
import './design-system/components/menu';
import './design-system/components/menu-item';
import './design-system/components/option';
import './design-system/components/progress-bar';
import './design-system/components/resize-observer';
import './design-system/components/select';
import './design-system/components/space';
import './design-system/components/skeleton';
import './design-system/components/spinner';
import './design-system/components/switch';
import './design-system/components/tag';
import './design-system/components/tooltip';
import './design-system/components/tree';
import './design-system/components/tree-item';
import './design-system/components/typography';
import './design-system/css/ol-light.css';

import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import WebFont from 'webfontloader';

import { AppContext, AppContextType } from '@/AppContext';
import AssetsPicker from '@/view/AssetsPicker';

type Props = {
  containerId?: string;
  extraFields?: string[];
  multiSelect?: boolean;
  publicApplicationName?: string;
  /**
   * Call back when we close the app modal.
   * Note: This only applicable when containerId is not defined
   * @returns
   */
  onClose?: () => void;
  onError: AppContextType['onError'];
  onAssetAction: AppContextType['onAssetAction'];
  onAssetSelected: AppContextType['onAssetSelected'];
  onImageSelected: AppContextType['onImageSelected'];
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
  multiSelect,
  onClose,
  onError,
  onAssetAction,
  onAssetSelected,
  onImageSelected,
}) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
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
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  const contextValue = useMemo(
    () => ({
      extraFields,
      onAssetAction,
      onAssetSelected,
      onImageSelected,
      onError,
      onClose: handleClose,
    }),
    [extraFields, handleClose, onAssetAction, onAssetSelected, onError, onImageSelected],
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
