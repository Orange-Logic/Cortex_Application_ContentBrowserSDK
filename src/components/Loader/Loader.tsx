import { Link, Box, CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import { MESSAGE_NEW_LINE } from '../../consts/data';

type LoaderProps = {
  message?: string;
  overlay?: boolean;
  children?: React.ReactNode;
};

const Loader = ({ message, overlay, children }: LoaderProps) => {
  return (
    <Box
      top={0}
      bottom={0}
      left={0}
      right={0}
      display="flex"
      flexDirection="column"
      alignItems="center"
      margin={2}
      style={
        overlay
          ? {
            backgroundColor: '#000',
            opacity: 0.5,
            color: '#fff',
          }
          : {}
      }
    >
      <CircularProgress />
      {message &&
        message.split(MESSAGE_NEW_LINE).map((line, index) =>
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
            <Typography
              key={index}
              variant="h5"
              marginTop={index == 0 ? 10 : 2}
            >
              {line}
            </Typography>
          ),
        )}
      {children}
    </Box>
  );
};

export default Loader;
