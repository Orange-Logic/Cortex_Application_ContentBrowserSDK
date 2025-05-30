import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppContext } from '@/AppContext';
import { GlobalConfigContext } from '@/GlobalConfigContext';
import { AppDispatch } from '@/store';
import { authErrorSelector, oAuth, setUseSession, siteUrlSelector } from '@/store/auth/auth.slice';
import { checkCorrectSiteUrl } from '@/utils/api';
import { LOGIN_GRAPHICS_TOP_COLOR_BASE64 } from '@/utils/constants';
import { useDebounceState } from '@/utils/hooks';
import { CxChangeEvent, CxInput } from '@/web-component';

const AuthenticatePage = () => {
  const { onClose } = useContext(AppContext);
  const dispatch = useDispatch<AppDispatch>();
  const siteUrl = useSelector(siteUrlSelector);
  const authError = useSelector(authErrorSelector);
  const { isContentBrowserPopedup, pluginInfo, useSession } = useContext(GlobalConfigContext);
  const [isDefined, setIsDefined] = useState(false);
  const [url, setUrl] = useState(siteUrl);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [checkingSite, setCheckingSite] = useDebounceState(false, 1000); // debounce to avoid flashing when check site connect too fast
  const [showUseSessionInput, setShowUseSessionInput] = useState(false);
  const [session, setSession] = useState(useSession);
  const siteInputRef = useRef<CxInput>(null);
  const sessionInputRef = useRef<CxInput>(null);
  const hiddenBoxRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    Promise.all([customElements.whenDefined('cx-input')]).then(() => {
      setIsDefined(true);
    });
  }, []);

  useEffect(() => {
    const input = siteInputRef.current;
    if (!input || !isDefined) return;
    const onInput = (e: CxChangeEvent) => {
      setUrl((e.target as HTMLInputElement).value);
      setUrlError(null);
    };
    input.addEventListener('cx-input', onInput);

    return () => {
      input.removeEventListener('cx-input', onInput);
    };
  }, [isDefined]);

  useEffect(() => {
    const input = sessionInputRef.current;
    if (!input || !isDefined) return;
    const onInput = (e: CxChangeEvent) => {
      setSession((e.target as HTMLInputElement).value);
    };
    input.addEventListener('cx-input', onInput);

    return () => {
      input.removeEventListener('cx-input', onInput);
    };
  }, [dispatch, isDefined, showUseSessionInput]);

  const onSubmit = useCallback(() => {
    setCheckingSite(true, true);
    const urlWithProtocol = url.indexOf('://') === -1 ? `https://${url}` : url;
    checkCorrectSiteUrl(urlWithProtocol)
      .then(() => {
        dispatch(oAuth({ siteUrl: urlWithProtocol }));
        if (session) {
          dispatch(setUseSession(session));
        }
      })
      .catch(() => {
        const errorMessage = 'The site is currently not available. Please verify your Site URL and check your Internet connection.';
        setUrlError(errorMessage);
      },
      )
      .finally(() => setCheckingSite(false));
  }, [dispatch, session, setCheckingSite, url]);

  const cancelConnect = useCallback(() => {
    setCheckingSite(false, true);
    setUrlError(null);
  }, [setCheckingSite]);

  useEffect(() => {
    // If the user clicks the hidden box 5 times in 2 second, show the session input
    if (showUseSessionInput) return;
    let clickCount = 0;
    let clickTimeout: NodeJS.Timeout | null = null;

    const handleClick = () => {
      clickCount++;
      if (clickCount === 5) {
        setShowUseSessionInput(true);
        if (clickTimeout) clearTimeout(clickTimeout);
        return;
      }
      if (clickTimeout) clearTimeout(clickTimeout);
      clickTimeout = setTimeout(() => {
        clickCount = 0;
      }, 2000);
    };

    const hiddenBox = hiddenBoxRef.current;
    if (hiddenBox) {
      hiddenBox.addEventListener('click', handleClick);
    }

    return () => {
      if (hiddenBox) {
        hiddenBox.removeEventListener('click', handleClick);
      }
      if (clickTimeout) clearTimeout(clickTimeout);
    };
  }, [showUseSessionInput]);

  let buttonText = 'Connect';
  if (checkingSite) {
    buttonText = 'Connecting...';
  } else if (urlError) {
    buttonText = 'Retry';
  }

  return (
    <div
      style={{
        background: `url(${LOGIN_GRAPHICS_TOP_COLOR_BASE64})`,
        backgroundPositionX: 'center',
        backgroundPositionY: 'top',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        display: 'flex',
        inset: 0,
        padding: 'var(--cx-spacing-x-small)',
        position: 'absolute',
      }}
    >
      {isContentBrowserPopedup && (
        <cx-icon-button
          name="close"
          label="Close"
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 'var(--cx-spacing-x-small)',
            right: 'var(--cx-spacing-x-small)',
            zIndex: 1000,
          }}
        ></cx-icon-button>
      )}
      <cx-space
        align-items="center"
        justify-content="center"
        style={{
          height: '100%',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <cx-space
          direction="vertical"
          spacing="medium"
          align-items="center"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSubmit();
            }
          }}
        >
          {pluginInfo.pluginName && (
            <cx-typography variant="h2">
              Welcome to the {pluginInfo.pluginName}
            </cx-typography>
          )}
          {pluginInfo.publicApplicationName && (
            <cx-typography variant="h4">
              for {pluginInfo.publicApplicationName}
            </cx-typography>
          )}
          {authError && (
            <cx-alert open variant="danger">
              <cx-icon slot="icon" name="error"></cx-icon>
              {authError}
            </cx-alert>
          )}
          <cx-input
            ref={siteInputRef}
            label="Site URL"
            placeholder="Enter your site URL"
            value={url}
            help-text={urlError ?? undefined}
            style={{
              width: '100%',
            }}
          ></cx-input>
          {showUseSessionInput && (
            <cx-input
              ref={sessionInputRef}
              label="Session ID"
              placeholder="Enter your session ID"
              value={useSession}
              style={{
                width: '100%',
              }}
            ></cx-input>
          )}
          <cx-space
            justify-content="flex-end"
            style={{
              width: '100%',
            }}
          >
            <cx-space spacing="small" wrap="nowrap">
              {checkingSite && (
                <cx-button variant="default" onClick={cancelConnect}>
                  Cancel
                </cx-button>
              )}
              <cx-button
                disabled={url === '' || checkingSite}
                variant="primary"
                style={{
                  width: '100%',
                }}
                onClick={onSubmit}
              >
                {buttonText}
              </cx-button>
            </cx-space>
          </cx-space>
        </cx-space>
      </cx-space>
      <button
        ref={hiddenBoxRef}
        tabIndex={-1}
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          opacity: 0,
          width: '32px',
          height: '32px',
        }}
      ></button>
    </div>
  );
};

export default AuthenticatePage;
