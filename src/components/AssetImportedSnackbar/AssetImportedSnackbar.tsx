import { Snackbar } from '@mui/material';
import { useEffect, useRef, useState, memo } from 'react';
import { useAppSelector } from '../../store';
import { assetsIsImportingSelector } from '../../store/assets/assets.slice';

const AssetImportedSnackbar = () => {
  const importing = useAppSelector(assetsIsImportingSelector);
  const preImportingState = useRef(importing);
  const [importNoti, setImportNoti] = useState(false);

  useEffect(() => {
    // Automatically reset the import state if import finish and the dialog is closed
    if (preImportingState.current == true && !importing) {
      setImportNoti(true);
    }
    preImportingState.current = importing;
  }, [importing]);

  return (
    <Snackbar
      open={importNoti}
      autoHideDuration={5000}
      onClose={() => setImportNoti(false)}
      message="Import Assets from Orange Dam completed"
    />
  );
};

export default memo(AssetImportedSnackbar, () => false);
