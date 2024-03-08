import CloseIcon from '@mui/icons-material/Close';
import { Button, Dialog, DialogActions, DialogProps, DialogTitle, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../store';
import { useGetAvailableProxiesQuery } from '../../store/assets/assets.api';
import { ASSETS_FEATURE_STORAGE_KEY_IMPORT_PROXY, importAssets, setImportProxy, setIsProxyModalOpen } from '../../store/assets/assets.slice';
import { deleteData, getData } from '../../utils/storage';
import MultipleProxyDialogContent from './MultipleProxyDialogContent';
import NoProxyDialogContent from './NoProxyDialogContent';

const SelectProxyModal = ({ open, ...props }: DialogProps) => {
  const { isSuccess, data } = useGetAvailableProxiesQuery();
  const [proxy, setProxy] = useState<string | undefined>();
  const [rememberProxy, setRememberProxy] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isSuccess && !!(data?.proxies) && Object.keys(data.proxies).length > 0) {
      getData(ASSETS_FEATURE_STORAGE_KEY_IMPORT_PROXY).then((storedImportProxy) => {
        if (storedImportProxy) {
          // If the stored import proxy is not in the list of available proxies, remove it, else set it as the import proxy
          if (!Object.values(data.proxies).includes(storedImportProxy)) {
            deleteData(ASSETS_FEATURE_STORAGE_KEY_IMPORT_PROXY);
          } else {
            dispatch(setImportProxy(storedImportProxy));
          }
        }
      });
    }
  }, [isSuccess, data]);

  const handleImport = async () => {
    dispatch(importAssets({ importProxy: proxy, rememberProxy }));
    dispatch(setIsProxyModalOpen(false));
  };
  
  useEffect(() => {
    if (isSuccess && !!(data?.proxies) && Object.keys(data.proxies).length === 1) {
      handleImport();
      open = false;
    }
  }, [isSuccess, data]);

  return (
    <Dialog
      open={open}
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
        Import Asset
        <IconButton sx={{
          position: 'absolute',
          top: '50%',
          right: 8,
          transform: 'translateY(-50%)',
          background: 'none !important',
        }} onClick={ () => dispatch(setIsProxyModalOpen(false))}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      {
        isSuccess && !!(data?.proxies)
          ? <>
            <MultipleProxyDialogContent proxies={data.proxies} onSetImportProxy={setProxy} onSetRememberImportProxy={setRememberProxy}/>
            <DialogActions sx={{ border: 'none' }}>
              <Button color='secondary' onClick={() => dispatch(setIsProxyModalOpen(false))}>Cancel</Button>
              <Button onClick={handleImport} disabled={!proxy}>Insert</Button>
            </DialogActions>
          </>
          : <NoProxyDialogContent />
      }
    </Dialog>
  );
};

export default SelectProxyModal;
