import { Link, Typography } from '@mui/material';
import { useContext, useMemo } from 'react';
import { useAppSelector } from '../../store';
import { appAuthUrlSelector, authStateSelector, siteUrlSelector } from '../../store/auth/auth.slice';
import { CortexColors } from '../../utils/constants';
import AuthenticatePage from './Authenticate';
import ConnectingBackground from './ConnectingBackground';
import { Box } from '@mui/system';
import { GlobalConfigContext } from '../../GlobalConfigContext';

const RestoreSession = () => {
  return (
    <ConnectingBackground>
      <Typography variant="h1" gutterBottom textAlign="center">
        Trying to restore your previous session
      </Typography>
    </ConnectingBackground>
  );
};

const RequestLogin = () => {
  const siteUrl = useAppSelector(siteUrlSelector);
  return (
    <ConnectingBackground>
      <Typography variant="h1" gutterBottom textAlign="center">
        Requesting login url from {siteUrl}
      </Typography>
    </ConnectingBackground>
  );
};

const WaitForAuthorise = () => {
  const appAuthUrl = useAppSelector(appAuthUrlSelector);
  const { pluginInfo } = useContext(GlobalConfigContext);

  return (
    <ConnectingBackground
      footer={
        <Box marginTop={30}>
          <Typography variant="h5" gutterBottom textAlign="center" sx={{
            fontSize: 15,
            color: CortexColors.A600,
          }}>
            I was not redirected automatically?
          </Typography>

          <Link href={appAuthUrl} fontSize={15} textAlign="center" display="block">{appAuthUrl}</Link>
        </Box>
      }
    >
      <Typography variant="h1" gutterBottom textAlign="center">
        Please authorize the Google Addon through Cortex
      </Typography>
      <Typography variant="h5" gutterBottom textAlign="center" sx={{
        fontSize: 15,
        color: CortexColors.A600,
      }}>
        You will be automatically redirected to authorize {pluginInfo.pluginShortName ? `the ${pluginInfo.pluginShortName} plugin ` : '' }in Orange DAM
      </Typography>
    </ConnectingBackground>
  );
};

const Authenticate = () => {
  const authState = useAppSelector(authStateSelector);

  return useMemo(() => {
    switch (authState) {
      case 'unauthenticated':
        return <AuthenticatePage />;
      case 'restoreSession':
        return <RestoreSession />;
      case 'requestLogin':
        return <RequestLogin />;
      case 'waitForAuthorise':
        return <WaitForAuthorise />;
    }
  }, [authState]);
};

export default Authenticate;
