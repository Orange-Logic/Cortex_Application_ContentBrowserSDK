import { useContext, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { GlobalConfigContext } from '@/GlobalConfigContext';
import { AppDispatch } from '@/store';
import { authErrorSelector, oAuth, siteUrlSelector } from '@/store/auth/auth.slice';
import { checkCorrectSiteUrl } from '@/utils/api';
import { CortexColors, LOGIN_GRAPHICS_TOP_COLOR_BASE64 } from '@/utils/constants';
import { useDebounceState } from '@/utils/hooks';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';

const AuthenticatePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const oAuthForm = useRef<HTMLFormElement>(null);
  const siteUrl = useSelector(siteUrlSelector);
  const authError = useSelector(authErrorSelector);
  const { pluginInfo } = useContext(GlobalConfigContext);
  const [url, setUrl] = useState(siteUrl);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [checkingSite, setCheckingSite] = useDebounceState(false, 1000); // debounce to avoid flashing when check site connect too fast

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setCheckingSite(true, true);
    const urlWithProtocol = url.indexOf('://') === -1 ? `https://${url}` : url;
    checkCorrectSiteUrl(urlWithProtocol)
      .then(() => dispatch(oAuth({ siteUrl: urlWithProtocol })))
      .catch(() => setUrlError('The site is currently not available. Please verify your Site URL and check your Internet connection.'))
      .finally(() => setCheckingSite(false));
  };

  const cancelConnect = () => {
    setCheckingSite(false, true);
    setUrlError(null);
  };

  let buttonText = 'Connect';
  if (checkingSite) {
    buttonText = 'Connecting...';
  } else if (urlError) {
    buttonText = 'Retry';
  }

  return (
    <Box
      sx={{
        background: `url(${LOGIN_GRAPHICS_TOP_COLOR_BASE64})`,
        backgroundPositionX: 'center',
        backgroundPositionY: 'top',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        position: 'absolute',
        inset: 0,
      }}
    >
      <Box
        display='flex'
        flexDirection='column'
        alignItems='stretch'
        justifyContent='center'
        sx={{ 
          height: '100%',
          margin: 'auto',
          minWidth: 700,
        }}
      >
        <Typography variant='h4' gutterBottom textAlign='center'>
          Welcome to the OrangeDAM Asset Browser
        </Typography>
        {
          pluginInfo.pluginName && (
            <Typography variant="h5" gutterBottom textAlign="center" sx={{
              fontSize: 15,
              color: CortexColors.A600,
            }}>
              for {pluginInfo.pluginName}
            </Typography>
          )
        }

        <Stack
          marginTop={20}
          spacing={2}
          component='form'
          noValidate
          onSubmit={onSubmit}
          ref={oAuthForm}
        >
          {authError && <Alert severity='error'>{authError}</Alert>}
          <Stack spacing={2}>
            <TextField
              error={!!urlError}
              label='Site URL'
              placeholder='Enter your OrangeDAM URL'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              helperText={urlError ?? undefined}
            />
          </Stack>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              width: 'min-content',
            }}>
              {checkingSite && <Button sx={{ mr: 2 }} color='secondary' onClick={cancelConnect}>Cancel</Button>}
              <Button disabled={url === '' || checkingSite} type="submit">
                {buttonText}
              </Button>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default AuthenticatePage;
