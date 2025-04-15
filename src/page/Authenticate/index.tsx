import { FC, useCallback, useContext, useMemo } from 'react';

import { GlobalConfigContext } from '@/GlobalConfigContext';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  appAuthUrlSelector, authStateSelector, cancelAuth, setUseSession, siteUrlSelector,
  USE_SESSION,
} from '@/store/auth/auth.slice';

import AuthenticatePage from './Authenticate';
import ConnectingBackground from './ConnectingBackground';

type Props = {
  onCancel: () => void;
};

const RestoreSession: FC<Props> = ({ onCancel }) => {
  const dispatch = useAppDispatch();
  const localStorageSession = localStorage.getItem(USE_SESSION);

  if (localStorageSession) {
    dispatch(setUseSession(localStorageSession));
  }
  
  return (
    <ConnectingBackground onCancel={onCancel}>
      <cx-typography variant="h3">
        Trying to restore your previous session
      </cx-typography>
    </ConnectingBackground>
  );
};

const RequestLogin: FC<Props> = ({ onCancel }) => {
  const siteUrl = useAppSelector(siteUrlSelector);
  return (
    <ConnectingBackground onCancel={onCancel}>
      <cx-typography variant="h3">
        Requesting login url from {siteUrl}
      </cx-typography>
    </ConnectingBackground>
  );
};

const WaitForAuthorize: FC<Props> = ({ onCancel }) => {
  const appAuthUrl = useAppSelector(appAuthUrlSelector);
  const { pluginInfo } = useContext(GlobalConfigContext);

  return (
    <ConnectingBackground
      footer={
        <>
          <cx-typography variant="body2">
            I was not redirected automatically?
          </cx-typography>

          <a href={appAuthUrl} target="_blank" rel="noopener noreferrer">{appAuthUrl}</a>
        </>
      }
      onCancel={onCancel}
    >
      <cx-typography variant="h3">
        Please authorize the {pluginInfo.pluginName} plugin
      </cx-typography>
      <cx-typography variant="body2">
        You will be automatically redirected to authorize {pluginInfo.pluginName} {pluginInfo.publicApplicationName ? `in ${pluginInfo.publicApplicationName}` : ''}
      </cx-typography>
    </ConnectingBackground>
  );
};

const Authenticate = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector(authStateSelector);

  const onCancel = useCallback(() => {
    dispatch(cancelAuth());
  }, [dispatch]);

  return useMemo(() => {
    switch (authState) {
      case 'unauthenticated':
        return <AuthenticatePage />;
      case 'restoreSession':
        return <RestoreSession onCancel={onCancel} />;
      case 'requestLogin':
        return <RequestLogin onCancel={onCancel} />;
      case 'waitForAuthorise':
        return <WaitForAuthorize onCancel={onCancel} />;
    }
  }, [authState, onCancel]);
};

export default Authenticate;
