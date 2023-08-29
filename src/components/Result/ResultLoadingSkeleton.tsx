import { Skeleton } from '@mui/material';
import { Box } from '@mui/system';

const ResultLoadingSkeleton = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Skeleton variant="rectangular" height={200} />
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: 1, padding: 2 }}
      >
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="60%" />
      </Box>
    </Box>
  );
};

export default ResultLoadingSkeleton;
