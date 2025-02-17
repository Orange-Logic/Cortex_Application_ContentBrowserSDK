import { useAppSelector } from '@/store';
import { isImportingSelector } from '@/store/assets/assets.slice';
import { CircularProgress, Dialog, DialogContent, Typography } from '@mui/material';

export const ImportingDialog = () => {
  const isImporting = useAppSelector(isImportingSelector);

  return (
    <Dialog
      open={isImporting}
      disablePortal
      sx={{ position: 'absolute' }}
    >
      <DialogContent sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}>
        <Typography variant="h5" gutterBottom>Importing your assets</Typography>
        <CircularProgress />
      </DialogContent>
    </Dialog>
  );
};

export default ImportingDialog;
