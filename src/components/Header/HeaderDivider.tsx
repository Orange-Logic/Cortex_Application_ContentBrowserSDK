import { CortexColors } from '@/utils/constants';
import { Divider } from '@mui/material';

export const HeaderDivider = () => {
  return <Divider
    color={CortexColors.A600}
    orientation="vertical"
    variant="middle"
    flexItem
  />;
};

export default HeaderDivider;
