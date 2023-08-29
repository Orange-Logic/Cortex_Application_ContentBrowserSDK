import { Box, Button, Divider, Skeleton, Typography } from '@mui/material';
import { useAppDispatch } from '../../store';
import { logout } from '../../store/auth/auth.slice';
import { useGetUserInfoQuery } from '../../store/user/user.api';
import { CortexColors, CortexFonts, LOGO_BASE64 } from '../../utils/constants';
import { reset } from '../../store/search/search.slice';
import { AppContext } from '../../AppContext';
import { useContext } from 'react';

const Header = () => {
  const dispatch = useAppDispatch();
  const { data, isFetching, isLoading } = useGetUserInfoQuery({});

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
        {isLoading || isFetching ? (
          <Skeleton
            variant="rounded"
            width={64}
            height={13}
            sx={{
              marginLeft: '10px',
            }}
          />
        ) : (
          <Typography
            variant="button"
            sx={{
              fontFamily: CortexFonts.Condensed,
              fontSize: 13,
              lineHeight: 1,
              letterSpacing: '0.015em',
              marginLeft: '10px',
              marginRight: 2,
              color: CortexColors.A600,
            }}
          >
            {data?.fullName}
          </Typography>
        )}
        <Divider
          color={CortexColors.A600}
          orientation="vertical"
          variant="middle"
          flexItem
        />
        <Button
          variant="text"
          color="primary"
          sx={{
            fontFamily: CortexFonts.Condensed,
            fontSize: 13,
            lineHeight: 1,
            letterSpacing: '0.015em',
          }}
          onClick={() => {
            dispatch(logout());
            dispatch(reset());
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
