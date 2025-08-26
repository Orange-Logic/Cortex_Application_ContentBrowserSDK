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
        Requesting login url from 
        <cx-typography variant="body1" style={{ overflowWrap:'break-word', lineBreak:'anywhere' }}>
          {siteUrl}
        </cx-typography>
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
          <cx-space spacing="small" direction="vertical">
            <cx-typography className='footer__title' variant='body2'>
              <span style={{ fontWeight: 'var(--cx-font-weight-semibold)' }}>I was not redirected automatically?</span>
            </cx-typography>
            <cx-typography variant="body2">
              Copy the URL and open it in a new tab
            </cx-typography>
            <cx-typography variant="body3">
              <cx-space spacing="3x-small" direction="horizontal" wrap="nowrap" alignItems="center" justifyContent="center"> 
                <a
                  id="OL-redirect-url"
                  href={appAuthUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ minWidth: 0, flexShrink: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--cx-color-primary-600)' }}
                >
                  {appAuthUrl}
                </a>
                <cx-copy-button size="small" from="OL-redirect-url[href]"/>
              </cx-space>
            </cx-typography>
          </cx-space>
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
