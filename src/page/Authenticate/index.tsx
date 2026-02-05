import { FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { GlobalConfigContext } from '@/GlobalConfigContext';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  appAuthUrlSelector, authStateSelector, cancelAuth, setUseSession, siteUrlSelector,
  USE_SESSION,
} from '@/store/auth/auth.slice';

import { getData } from '@/utils/storage';
import AuthenticatePage from './Authenticate';
import ConnectingBackground from './ConnectingBackground';
import styled from 'styled-components';
import { CxTypographyProps } from '@orangelogic/design-system/react-types';
import type { CxCopyButton } from '@orangelogic/design-system';
import { AppContext } from '@/AppContext';

const ResponsiveTypography = styled('cx-typography')<CxTypographyProps>`
  @container connecting-background (min-width: 0px) {
    &::part(base) {
      font-size: clamp(1rem, 2cqw, 3rem);
    }
  }
`;

type Props = {
  onCancel: () => void;
};

const RestoreSession: FC<Props> = ({ onCancel }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    getData(USE_SESSION).then((storedSession) => {
      if (storedSession) {
        dispatch(setUseSession(storedSession));
      }
    }).catch(() => {});
  });
  
  return (
    <ConnectingBackground onCancel={onCancel}>
      <ResponsiveTypography variant="h4">
        Trying to restore your previous session
      </ResponsiveTypography>
    </ConnectingBackground>
  );
};

const RequestLogin: FC<Props> = ({ onCancel }) => {
  const siteUrl = useAppSelector(siteUrlSelector);
  return (
    <ConnectingBackground onCancel={onCancel}>
      <ResponsiveTypography variant="h4">
        Requesting login url from 
        <cx-typography variant="body1" style={{ overflowWrap:'break-word', lineBreak:'anywhere' }}>
          {siteUrl}
        </cx-typography>
      </ResponsiveTypography>
    </ConnectingBackground>
  );
};

const WaitForAuthorize: FC<Props> = ({ onCancel }) => {
  const appAuthUrl = useAppSelector(appAuthUrlSelector);
  const { pluginInfo } = useContext(GlobalConfigContext);
  const { onAppAuthUrlCopied } = useContext(AppContext);
  const copyButtonRef = useRef<CxCopyButton>(null);
  const [isDefined, setIsDefined] = useState(false);

  useEffect(() => {
    customElements.whenDefined('cx-copy-button').then(() => {
      setIsDefined(true);
    });
  }, []);

  useEffect(() => {
    if (!isDefined) return;
    const copyButton = copyButtonRef.current;
    if (!copyButton) return;
    copyButton.writeToClipboard = onAppAuthUrlCopied;
  }, [isDefined, onAppAuthUrlCopied]);
  
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
            <br />
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
                <cx-copy-button ref={copyButtonRef} size="small" from="OL-redirect-url[href]"/>
              </cx-space>
            </cx-typography>
          </cx-space>
        }
        onCancel={onCancel}
      >
        <ResponsiveTypography variant="h4">
          Please authorize the {pluginInfo.pluginName} plugin
        </ResponsiveTypography>
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
      case 'waitForAuthorize':
        return <WaitForAuthorize onCancel={onCancel} />;
    }
  }, [authState, onCancel]);
};

export default Authenticate;
