import { Dialog, ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import WebFont from 'webfontloader';
import { CortexColors, CortexFonts } from './utils/constants';
import AssetsPicker from './view/AssetsPicker';
import { AppContext, AppContextType, ImageCardDisplayInfo } from './AppContext';

const theme = createTheme({
  palette: {
    primary: {
      main: CortexColors.B500,
      dark: CortexColors.B600,
      contrastText: CortexColors.A0,
    },
    secondary: {
      main: CortexColors.A100,
      dark: CortexColors.A200,
      contrastText: CortexColors.A700,
    },
    success: {
      main: CortexColors.C700,
    },
    common: {
      black: CortexColors.A700,
      white: CortexColors.A0,
    },
    text: {
      primary: CortexColors.A700,
      secondary: CortexColors.A500,
    },
  },
  typography: {
    fontSize: 13,
    fontFamily: [
      CortexFonts.Main,
      CortexFonts.Condensed,
      CortexFonts.ExtraCondensed,
    ].join(','),
    fontWeightBold: 500,
    fontWeightRegular: 400,
    fontWeightLight: 300,
    fontWeightMedium: 500,
    h1: {
      fontSize: 24,
      fontWeight: 500,
      lineHeight: 1.15,
      color: CortexColors.A700,
    },
    h5: {
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 1.15,
      color: CortexColors.A600,
    },
    h6: {
      fontSize: 15,
      fontWeight: 400,
      lineHeight: '20px',
      color: CortexColors.A600,
    },
    caption: {
      fontSize: 10,
      fontWeight: 400,
      lineHeight: 1.15,
      color: CortexColors.A500,
    },
  },
  spacing: 4,
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
        variant: 'contained',
        size: 'small',
      },
      styleOverrides: {
        root: {
          fontFamily: CortexFonts.Condensed,
          lineHeight: 1,
          fontSize: 15,
          fontWeight: 400,
          letterSpacing: '0.015em',
          textTransform: 'uppercase',
          padding: 8,
          borderRadius: 4,
          boxShadow: 'none!important',
        },
        containedPrimary: {
          color: CortexColors.A0,
          backgroundColor: CortexColors.B500,
          '&:hover': {
            backgroundColor: CortexColors.B600,
          },
          '&:focus': {
            backgroundColor: CortexColors.B600,
            outline: `2px solid ${CortexColors.B300}`,
          },

          '&:active': {
            backgroundColor: CortexColors.B700,
            outline: 'none',
          },
          '&.Mui-disabled': {
            opacity: 0.3,
            color: CortexColors.A0,
            backgroundColor: CortexColors.B500,
          },
        },
        containedSecondary: {
          color: CortexColors.A600,
          backgroundColor: CortexColors.A100,
          '&:hover': {
            backgroundColor: CortexColors.A200,
          },
          '&:focus': {
            backgroundColor: CortexColors.A200,
            outline: `2px solid ${CortexColors.B300}`,
          },

          '&:active': {
            backgroundColor: CortexColors.A300,
            outline: 'none',
          },
          '&.Mui-disabled': {
            opacity: 0.3,
            color: CortexColors.A600,
            backgroundColor: CortexColors.A100,
          },
        },
        textPrimary: {
          color: CortexColors.A600,
          backgroundColor: CortexColors.A0,
          '&:hover': {
            backgroundColor: CortexColors.A200,
          },
          '&:focus': {
            backgroundColor: CortexColors.A200,
            outline: `2px solid ${CortexColors.B300}`,
          },

          '&:active': {
            backgroundColor: CortexColors.A300,
            outline: 'none',
          },
          '&.Mui-disabled': {
            opacity: 0.3,
            color: CortexColors.A600,
            backgroundColor: CortexColors.A100,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: CortexColors.A700,
          backgroundColor: CortexColors.A0,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: CortexFonts.Condensed,
          fontWeight: 400,
          color: '#737373',
        },
        shrink: {
          paddingTop: 5,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: `${CortexColors.A300} !important`,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: `${CortexColors.A600} !important`,
          },
          '&:active .MuiOutlinedInput-notchedOutline': {
            borderColor: `${CortexColors.B500} !important`,
          },
          '&:focus-within .MuiOutlinedInput-notchedOutline': {
            borderColor: `${CortexColors.B500} !important`,
          },
        },
        notchedOutline: {
          borderRadius: 4,
        },
      },
    },
    MuiCheckbox: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          fontFamily: CortexFonts.Main,
          fontWeight: 400,
          fontSize: 15,
          lineHeight: '20px',
          color: CortexColors.A600,
          padding: 4,
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginLeft: 0,
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontFamily: CortexFonts.Main,
          fontWeight: 400,
          color: CortexColors.A600,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          fontSize: 18,
          lineHeight: 1.15,
          fontFamily: CortexFonts.Main,
          color: CortexColors.A700,
          borderBottom: `1px solid ${CortexColors.A200}`,
          '& + .MuiDialogContent-root': {
            paddingTop: '16px !important',
          },
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          borderTop: `1px solid ${CortexColors.A200}`,
        },
      },
    },
  },
});

type AppProps = {
  multiSelect?: boolean;
  containerId?: string;
  displayInfo?: ImageCardDisplayInfo;
  /**
   * Call back when we close the app modal.
   * Note: This only applicable when containerId is not defined
   * @returns 
   */
  onClose?: () => void;
  onError: AppContextType['onError'];
  onImageSelected: AppContextType['onImageSelected'];
};

const defaultDisplayInfo = {
  title: true,
  dimension: true,
  fileSize: true,
  tags: true,
};
    

export const App = ({ multiSelect, displayInfo, containerId, onClose, onError, onImageSelected }: AppProps) => {
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
  const smallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);

    if (!!containerId && typeof onClose !== 'undefined') {
      onClose();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={{
        onImageSelected,
        onError,
        displayInfo: { ...defaultDisplayInfo, ...displayInfo },
      }}>
        {
          containerId ?
            <AssetsPicker handleClose={handleClose} multiSelect={multiSelect} />
            : <Dialog
              onClose={handleClose}
              open={open}
              fullScreen
              sx={{
                padding: smallScreen ? '2em' : '6em',
                display: 'flex',
                flexDirection: 'column',
              }}
              PaperProps={{ sx: { borderRadius: '0.5em' } }}
            >
              <AssetsPicker handleClose={handleClose} multiSelect={multiSelect} />
            </Dialog>
        }
      </AppContext.Provider>
    </ThemeProvider>
  );
};

export default App;