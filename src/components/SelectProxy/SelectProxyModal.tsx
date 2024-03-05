import CloseIcon from '@mui/icons-material/Close';
import { Button, Dialog, DialogActions, DialogProps, DialogTitle, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../store';
import { useGetAvailableProxiesQuery } from '../../store/assets/assets.api';
import { importAssets, setIsProxyModalOpen, setSelectedAssets } from '../../store/assets/assets.slice';
import MultipleProxyDialogContent from './MultipleProxyDialogContent';
import NoProxyDialogContent from './NoProxyDialogContent';

const SelectProxyModal = ({ open, ...props }: DialogProps) => {
  const { isSuccess, data } = useGetAvailableProxiesQuery();
  const [importProxy, setImportProxy] = useState<string | undefined>();
  const [rememberProxy, setRememberProxy] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleCancelImport = () => { 
    dispatch(setSelectedAssets([]));
    dispatch(setIsProxyModalOpen(false));
  };

  const handleImport = async () => {
    dispatch(importAssets({ importProxy, rememberProxy }));
    handleCancelImport();
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
            <MultipleProxyDialogContent proxies={data.proxies} onSetImportProxy={setImportProxy} onSetRememberImportProxy={setRememberProxy}/>
            <DialogActions sx={{ border: 'none' }}>
              <Button color='secondary' onClick={handleCancelImport}>Cancel</Button>
              <Button onClick={handleImport} disabled={!importProxy}>Insert</Button>
            </DialogActions>
          </>
          : <NoProxyDialogContent />
      }
    </Dialog>
  );
};

export default SelectProxyModal;
