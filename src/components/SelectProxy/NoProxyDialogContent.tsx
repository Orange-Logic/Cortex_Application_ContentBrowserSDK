import { DialogContent, DialogContentText } from '@mui/material';

export const NoProxyDialogContent = () => {
  return (
    <DialogContent>
      <DialogContentText id="alert-dialog-slide-description">
        Failed to load available proxies from the server.
      </DialogContentText>
    </DialogContent>
  );
};

export default NoProxyDialogContent;