import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Divider, FormControl, IconButton } from '@mui/material';
import { Fragment, useContext, useLayoutEffect, useRef } from 'react';
import { GlobalConfigContext } from '../../GlobalConfigContext';
import { useAppDispatch, useAppSelector } from '../../store';
import { useGetAvailableProxiesQuery } from '../../store/assets/assets.api';
import { importAssets, isImportingSelector, isProxyModalOpenSelector, selectedAssetsSelector, setIsProxyModalOpen, setStoredProxiesPreference, SETTINGS_DEFAULT_PROXY, storedProxiesPreferenceSelector } from '../../store/assets/assets.slice';
import { StringTable } from '../../types/common';
import { HasElements } from '../../utils/array';
import { IsStringFilled } from '../../utils/string';
import MultipleProxySelectorDialogContent from './MultipleProxyDialogContent';
import NoProxyDialogContent from './NoProxyDialogContent';
import RememberProxyCheckBox from './RememberProxyCheckBox';
import SelectedAssetsInfo from './SelectedAssetsInfo';

const SelectProxyModal = ({ ...props }: Omit<DialogProps, 'open'>) => {
  const dispatch = useAppDispatch();
  const selectedAssets = useAppSelector(selectedAssetsSelector);
  const proxiesPreference = useAppSelector(storedProxiesPreferenceSelector);
  const isProxyModalOpen = useAppSelector(isProxyModalOpenSelector);
  const isImporting = useAppSelector(isImportingSelector);
  const { isSuccess, data } = useGetAvailableProxiesQuery({ assetImages: selectedAssets });
  
  const { pluginInfo } = useContext(GlobalConfigContext);

  // Handle remember proxy
  const shouldRemember = useRef(false);
  const setRemember = (value: boolean) => {
    shouldRemember.current = value;
  };

  // Handle selected proxy
  const docTypeAndProxy = useRef<Partial<StringTable>>(proxiesPreference);
  const setProxy = (docType: string, selectedProxy: string) => {
    docTypeAndProxy.current = { ...docTypeAndProxy.current, [docType]: selectedProxy };
  };

  const handleImport = () => {
    if (HasElements(data?.proxiesForDocType)) {
      if (shouldRemember.current) {
        dispatch(setStoredProxiesPreference(docTypeAndProxy.current));
      }
      dispatch(importAssets(docTypeAndProxy.current));
    }
  };

  useLayoutEffect(() => {
    if (isProxyModalOpen && !isImporting
        && isSuccess && HasElements(data.proxiesForDocType)) {
      /**
       * Determine if we can skip proxy selection. There are 3 cases:
       * 1. For all Doctype => all has preference => Can skip proxy selection
       * 2. For all Doctype => many has no preference, only one proxy available => Can skip proxy selection
       * 3. For all Doctype => many has no preference, multiple proxies available => Can't skip proxy selection
       */ 
      const shouldSkipProxySelection = Object.entries(data.proxiesForDocType).every(([docType, proxyInfos])=> {
        const proxies         = Object.keys(proxyInfos);
        const proxyPreference = (proxiesPreference[docType] || docTypeAndProxy.current[docType]) as string;

        if (IsStringFilled(proxyPreference) && proxyPreference !== SETTINGS_DEFAULT_PROXY) {
          // The proxy preference might be outdated, check it first
          if (proxies.indexOf(proxyPreference)) {
            setProxy(docType, proxyPreference);
            return true;
          } else {
            // The list of available proxies has been updated, remove the preference
            dispatch(setStoredProxiesPreference({ [docType]: undefined }));
          }
        }
        if (proxies.length === 1) {
          setProxy(docType, proxies[0]);
          return true;
        }

        return false;
      });

      if (shouldSkipProxySelection) {
        handleImport();
      }
    }
  }, [isProxyModalOpen, isImporting, isSuccess, data]);

  return (
    <Dialog
      open={isProxyModalOpen}
      disablePortal
      scroll='body'
      PaperProps={{ sx: { width: '30%', minWidth: 400 } }}
      onClose={(_, reason) => {
        if (!((reason === 'backdropClick' || reason === 'escapeKeyDown'))) {
          dispatch(setIsProxyModalOpen(false));
        }
      }}
      sx={{ position: 'absolute' }}
      {...props}
    >
      <DialogTitle sx={{
        position: 'relative',
        border: 'none',
      }}>
        {pluginInfo.pluginShortName ? `Add to ${pluginInfo.pluginShortName}` : 'Import Asset'}
        <IconButton sx={{
          position: 'absolute',
          top: '50%',
          right: 8,
          transform: 'translateY(-50%)',
          background: 'none !important',
        }} onClick={() => dispatch(setIsProxyModalOpen(false))}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      {
        isSuccess && HasElements(data?.proxiesForDocType)
          ? <DialogContent sx={{ maxHeight: 400, userSelect: 'none' }}>
            <Box padding={2} bgcolor="#fff">
              <FormControl fullWidth>
                <SelectedAssetsInfo />
                <Divider />
                {
                  Object.entries(data.proxiesForDocType).map(([docType, proxies], index) => (
                    <Fragment key={docType + index}>
                      <MultipleProxySelectorDialogContent docType={docType} proxyInfos={proxies} onSetImportProxy={setProxy} />
                      <Divider />
                    </Fragment>
                  ))
                }
                <RememberProxyCheckBox setRemember={setRemember} />
                <DialogActions sx={{ border: 'none' }}>
                  <Button color='secondary' onClick={() => dispatch(setIsProxyModalOpen(false))}>Cancel</Button>
                  <Button onClick={handleImport} disabled={!docTypeAndProxy}>
                    {pluginInfo.pluginShortName ? `Add to ${pluginInfo.pluginShortName}` : 'Insert'}
                  </Button>
                </DialogActions>
              </FormControl>
            </Box>
          </DialogContent>
          : <NoProxyDialogContent />
      }
    </Dialog>
  );
};

export default SelectProxyModal;
