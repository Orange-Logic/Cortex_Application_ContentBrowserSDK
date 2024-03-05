import { Box } from '@mui/material';
import { useAppDispatch } from '../../store';
import { logout } from '../../store/auth/auth.slice';
import { openSettings } from '../../store/navigation/navigation.slice';
import { reset } from '../../store/search/search.slice';
import { LOGO_BASE64 } from '../../utils/constants';
import HeaderButton from './HeaderButton';
import HeaderDivider from './HeaderDivider';
import UserName from './UserName';

const Header = () => {
  const dispatch = useAppDispatch();

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
        <HeaderButton onClick={() => dispatch(openSettings())}>Settings</HeaderButton>
        <HeaderDivider />
        <HeaderButton
          onClick={() => {
            dispatch(logout());
            dispatch(reset());
          }}
        >
          Logout
        </HeaderButton>
      </Box>
    </Box>
  );
};

export default Header;
