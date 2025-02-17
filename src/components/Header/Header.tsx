import { useContext } from 'react';

import { AppContext } from '@/AppContext';
import { GlobalConfigContext } from '@/GlobalConfigContext';
import { useAppDispatch } from '@/store';
import { resetImportStatus } from '@/store/assets/assets.slice';
import { logout } from '@/store/auth/auth.slice';
import { openSettings } from '@/store/navigation/navigation.slice';
import { resetSearchState } from '@/store/search/search.slice';
import { LOGO_BASE64 } from '@/utils/constants';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton } from '@mui/material';

import HeaderButton from './HeaderButton';
import HeaderDivider from './HeaderDivider';
import UserName from './UserName';

const Header = () => {
  const dispatch = useAppDispatch();
  const { isGABPopedup } = useContext(GlobalConfigContext);
  const { onClose } = useContext(AppContext);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        paddingLeft: 2,
        paddingY: 1,
      }}
    >
      <Box
        component="img"
        src={LOGO_BASE64}
        sx={{
          height: 30,
          pb: 3,
        }}
      ></Box>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          width: 'fit-content',
        }}
      >
        <UserName />
        <HeaderDivider />
        <HeaderButton onClick={() => dispatch(openSettings())}>
          Settings
        </HeaderButton>
        <HeaderDivider />
        <HeaderButton
          onClick={() => {
            dispatch(logout());
            dispatch(resetSearchState());
            dispatch(resetImportStatus());
          }}
        >
          Logout
        </HeaderButton>
        {isGABPopedup && (
          <>
            <HeaderDivider />
            <IconButton size="small" disableRipple onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Header;
