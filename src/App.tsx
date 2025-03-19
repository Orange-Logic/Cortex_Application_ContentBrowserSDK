import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import WebFont from 'webfontloader';

import { AppContext, AppContextType } from '@/AppContext';
import AssetsPicker from '@/view/AssetsPicker';

type Props = {
  containerId?: string;
  extraFields?: string[];
  multiSelect?: boolean;
  pluginName?: string;
  /**
   * Call back when we close the app modal.
   * Note: This only applicable when containerId is not defined
   * @returns
   */
  onClose?: () => void;
  onError: AppContextType['onError'];
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
  onAssetSelected,
  onImageSelected,
}) => {
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

    const script = document.createElement('script');
    script.src = 'https://design-system.orangelogic.com/entry.1.0.170.js';
    script.type = 'module';
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
    
  }, []);
  const [open, setOpen] = useState(true);

  const handleClose = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  const contextValue = useMemo(
    () => ({
      extraFields,
      onAssetSelected,
      onImageSelected,
      onError,
      onClose: handleClose,
    }),
    [extraFields, handleClose, onAssetSelected, onError, onImageSelected],
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
