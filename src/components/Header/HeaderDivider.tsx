import { Divider } from '@mui/material';
import { CortexColors } from '../../utils/constants';

export const HeaderDivider = () => {
  return <Divider
    color={CortexColors.A600}
    orientation="vertical"
    variant="middle"
    flexItem
  />;
};

export default HeaderDivider;
