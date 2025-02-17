import { MESSAGE_NEW_LINE } from '@/consts/data';
import { Box, CircularProgress, Link } from '@mui/material';
import Typography from '@mui/material/Typography';

type LoaderProps = {
  message?: string;
  overlay?: boolean;
  children?: React.ReactNode;
};

const Loader = ({ message, overlay, children }: LoaderProps) => {
  return (
    <Box
      sx={{
        inset: 0,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        m: 2,
        ...(overlay
          ? {
            backgroundColor: '#000',
            opacity: 0.5,
            color: '#fff',
          }
          : {}),
      }}
    >
      <CircularProgress />
      {message?.split(MESSAGE_NEW_LINE).map((line, index) =>
        line.indexOf('http') !== -1 ? (
          <Link
            key={index}
            marginTop={index == 0 ? 10 : 2}
            href={line}
            target="_blank"
          >
            {line}
          </Link>
        ) : (
          <Typography key={index} variant="h5" marginTop={index == 0 ? 10 : 2}>
            {line}
          </Typography>
        ),
      )}
      {children}
    </Box>
  );
};

export default Loader;
