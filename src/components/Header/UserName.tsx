import { useGetUserInfoQuery } from '@/store/user/user.api';
import { CortexColors, CortexFonts } from '@/utils/constants';
import { Skeleton, Typography } from '@mui/material';

export const UserName = () => {
  const { data, isFetching, isLoading } = useGetUserInfoQuery({});

  return isLoading || isFetching ? (
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
  );
};

export default UserName;
