import ImageIcon from '@mui/icons-material/Image';
import { FormLabel } from '@mui/material';
import { FC } from 'react';
import { useAppSelector } from '../../store';
import { totalSelectedAssetSelector } from '../../store/assets/assets.slice';

export const SelectedAssetsInfo: FC = () => {
  const totalSelectedAsset = useAppSelector(totalSelectedAssetSelector);

  return <FormLabel id="format-label" sx={{
    display: 'flex',
    alignItems: 'center',
    marginBottom: 2,
    gap: 2,
  }}>
    <ImageIcon color='inherit' fontSize='small' />{totalSelectedAsset} Selected Asset{totalSelectedAsset > 1 ? 's' : ''}
  </FormLabel >;
};

export default SelectedAssetsInfo;