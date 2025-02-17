import FolderOffIcon from '@mui/icons-material/FolderOff';
import { Box } from '@mui/system';
import { CortexColors } from '@/utils/constants';

export const NoResult = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 4,
        padding: 2,
        color: CortexColors.A400,
        textAlign: 'center',
      }}
    >
      <FolderOffIcon
        sx={{
          fontSize: '96px',
        }}
      />
      No matching results
    </Box>
  );
};
