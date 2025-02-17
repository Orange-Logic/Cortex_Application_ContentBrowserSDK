import { useContext } from 'react';

import { GlobalConfigContext } from '@/GlobalConfigContext';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  importAssetErrorMessageSelector, resetImportStatus, setIsProxyModalOpen,
} from '@/store/assets/assets.slice';
import { AssetImage } from '@/types/search';
import { HasElements } from '@/utils/array';
import { CortexColors } from '@/utils/constants';
import { Alert, Box, Button, Snackbar, Typography } from '@mui/material';

type FooterProps = {
  multiSelect?: boolean;
  selectedAssets: AssetImage[];
  deselectAll: () => void;
};

const Footer = ({ multiSelect = false, selectedAssets, deselectAll }: FooterProps) => {
  const errorMessage = useAppSelector(importAssetErrorMessageSelector);
  const dispatch    = useAppDispatch();
  const { pluginInfo } = useContext(GlobalConfigContext);

  const onImportSelectedAssets = async () => {
    if (HasElements(selectedAssets)) {
      // Open the proxy modal selector and let the user select the proxy
      dispatch(setIsProxyModalOpen(true));
    }
  };

  const handleSnackbarClose = () => {
    dispatch(resetImportStatus());
  };

  return <Box
    sx={{
      position: 'absolute',
      boxSizing: 'border-box',
      width: '100%',
      bottom: 0,
      display: 'flex',
      justifyContent: 'end',
      alignItems: 'center',
      padding: '8px 12px',
      gap: 2,
      backgroundImage: `linear-gradient(to left, ${CortexColors.A0} 520px, transparent, transparent)`,
    }}
  >
    {(selectedAssets.length > 0 && multiSelect) &&
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}>
          <Typography sx={{ color: CortexColors.A500, fontWeight: '600' }}>
            {selectedAssets.length}
          </Typography>
          <Typography sx={{ color: CortexColors.A500, fontWeight: '500' }}>
            Selected
          </Typography>
        </Box>
        <Button
          variant="outlined"
          sx={{
            color: CortexColors.A500,
            backgroundColor: CortexColors.A100,
            borderColor: 'transparent',
            '&:hover': {
              backgroundColor: CortexColors.A200,
              borderColor: 'transparent',
            },
            '&:active': {
              backgroundColor: CortexColors.A300,
              borderColor: 'transparent',
            },
            '&:focused': {
              backgroundColor: CortexColors.A200,
              borderColor: CortexColors.B300,
            },
            minWidth: 140,
          }}
          onClick={deselectAll}
        >
          Deselect All
        </Button>
      </Box>
    }
    <Button
      sx={{
        backgroundColor: CortexColors.B500,
        color: CortexColors.A0,
        minWidth: 140,
      }}
      onClick={onImportSelectedAssets}
      disabled={selectedAssets.length === 0}
    >
      Add selected assets {pluginInfo.pluginShortName ? `to ${pluginInfo.pluginShortName}` : '' }
    </Button>

    <Snackbar
      open={!!errorMessage}
      autoHideDuration={3000}
      onClose={handleSnackbarClose}
      sx={{ position: 'absolute' }}
    >
      <Alert
        onClose={handleSnackbarClose}
        severity="error"
        variant="filled"
        sx={{
          maxWidth: '70%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'pre-line',
        }}
      >
        {errorMessage}
      </Alert>
    </Snackbar>
  </Box>;
};

export default Footer;
