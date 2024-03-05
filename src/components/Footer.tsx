import { Box, Button, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store';
import { importAssets, importProxySelector, setIsProxyModalOpen } from '../store/assets/assets.slice';
import { AssetImage } from '../types/search';
import { CortexColors } from '../utils/constants';

type FooterProps = {
  multiSelect?: boolean;
  selectedAssets: AssetImage[];
  deselectAll: () => void;
};

const Footer = ({ multiSelect = false, selectedAssets, deselectAll }: FooterProps) => {
  const importProxy = useAppSelector(importProxySelector);
  const dispatch    = useAppDispatch();

  const handleClickConfirm = async () => {
    if (!importProxy) {
      // If import proxy is not defined, fetch it then show a pop up to let user choose the proxy
      if (selectedAssets.length > 0) {
        dispatch(setIsProxyModalOpen(true));
      }
    } else {
      dispatch(importAssets({ rememberProxy: false }));
    }
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
      backgroundImage: `linear-gradient(to left, ${CortexColors.A0} 400px, transparent, transparent)`,
    }}
  >
    <Typography sx={{ color: CortexColors.A500 }} fontWeight='500' fontStyle='italic'>
      Selecting {multiSelect ? 'multiple assets' : 'a single asset'}
    </Typography>
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
      }}
      onClick={handleClickConfirm}
    >
      Confirm
    </Button>
  </Box>;
};

export default Footer;
