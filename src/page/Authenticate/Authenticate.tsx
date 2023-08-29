import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useContext, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoaderContext } from '../../components/Loader/LoaderWrapper';
import { AppDispatch } from '../../store';
import { abortGetAccessKeyController } from '../../store/auth/auth.service';
import {
  authErrorSelector,
  oAuth,
  siteUrlSelector,
} from '../../store/auth/auth.slice';
import { checkCorrectSiteUrl } from '../../utils/api';
import { CortexColors } from '../../utils/constants';

const CancelAuthenticateButton = () => {
  return (
    <Button
      color='secondary'
      variant='contained'
      sx={{ marginY: 8 }}
      onClick={() => abortGetAccessKeyController.abort()}
    >
      Cancel
    </Button>
  );
};

const Authenticate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const oAuthForm = useRef<HTMLFormElement>(null);
  const siteUrl = useSelector(siteUrlSelector);
  const authError = useSelector(authErrorSelector);
  const [url, setUrl] = useState(siteUrl);
  const [urlError, setUrlError] = useState<string | null>(null);
  const { setCustomAction } = useContext(LoaderContext);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    const urlWithProtocol = url.indexOf('://') === -1 ? `https://${url}` : url;
    e.preventDefault();
    checkCorrectSiteUrl(urlWithProtocol)
      .then(() => {
        setCustomAction(<CancelAuthenticateButton />);
        dispatch(oAuth({ siteUrl: urlWithProtocol }));
      })
      .catch(() => {
        setUrlError(
          `Site ${url} is not available. Please check your internet connection`,
        );
      });
  };

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='stretch'
      justifyContent='center'
      sx={{ 
        backgroundColor: CortexColors.A0,
        height: '100%',
        margin: 'auto',
        minWidth: 600,
      }}
    >
      <Typography variant='h4' gutterBottom textAlign='center'>
        OrangeDam Assets Browser
      </Typography>

      <Stack
        spacing={2}
        component='form'
        noValidate
        onSubmit={onSubmit}
        ref={oAuthForm}
      >
        {authError && <Alert severity='error'>{authError}</Alert>}
        <TextField
          error={!!urlError}
          label='Site URL'
          placeholder='Enter your OrangeDAM URL'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          helperText={urlError ?? undefined}
        />
        <Box alignSelf='end'>
          <Button variant='contained' disabled={!url} type='submit'>
            connect
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default Authenticate;
