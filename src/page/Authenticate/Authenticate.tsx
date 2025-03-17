import { FormEventHandler, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { GlobalConfigContext } from '@/GlobalConfigContext';
import { AppDispatch } from '@/store';
import { authErrorSelector, oAuth, siteUrlSelector } from '@/store/auth/auth.slice';
import { checkCorrectSiteUrl } from '@/utils/api';
import { LOGIN_GRAPHICS_TOP_COLOR_BASE64 } from '@/utils/constants';
import { useDebounceState } from '@/utils/hooks';
import { CxChangeEvent, CxInput } from '@/web-component';

const AuthenticatePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const siteUrl = useSelector(siteUrlSelector);
  const authError = useSelector(authErrorSelector);
  const { pluginInfo } = useContext(GlobalConfigContext);
  const [isDefined, setIsDefined] = useState(false);
  const [url, setUrl] = useState(siteUrl);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [checkingSite, setCheckingSite] = useDebounceState(false, 1000); // debounce to avoid flashing when check site connect too fast
  const oAuthForm = useRef<HTMLFormElement>(null);
  const inputRef = useRef<CxInput>(null);

  useEffect(() => {
    Promise.all([customElements.whenDefined('cx-input')]).then(() => {
      setIsDefined(true);
    });
  }, []);

  useEffect(() => {
    const input = inputRef.current;
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

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback((e) => {
    e.preventDefault();
    setCheckingSite(true, true);
    const urlWithProtocol = url.indexOf('://') === -1 ? `https://${url}` : url;
    checkCorrectSiteUrl(urlWithProtocol)
      .then(() => dispatch(oAuth({ siteUrl: urlWithProtocol })))
      .catch(() => {
        const errorMessage = 'The site is currently not available. Please verify your Site URL and check your Internet connection.';
        setUrlError(errorMessage);
      },
      )
      .finally(() => setCheckingSite(false));
  }, [dispatch, setCheckingSite, url]);

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
    <div
      style={{
        background: `url(${LOGIN_GRAPHICS_TOP_COLOR_BASE64})`,
        backgroundPositionX: 'center',
        backgroundPositionY: 'top',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        display: 'flex',
        inset: 0,
        position: 'absolute',
      }}
    >
      <form
        onSubmit={onSubmit}
        ref={oAuthForm}
        style={{
          display: 'flex',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <cx-space
          direction="vertical"
          spacing="medium"
          style={{
            alignItems: 'center',
          }}
        >
          <cx-typography variant="h2">
            Welcome to the OrangeDAM Asset Browser
          </cx-typography>
          {pluginInfo.pluginName && (
            <cx-typography variant="h4">
              for {pluginInfo.pluginName ?? 'aaa'}
            </cx-typography>
          )}
          {authError && (
            <cx-alert open variant="danger">
              <cx-icon slot="icon" name="error"></cx-icon>
              {authError}
            </cx-alert>
          )}
          <cx-input
            ref={inputRef}
            label="Site URL"
            placeholder="Enter your OrangeDAM URL"
            value={url}
            help-text={urlError ?? undefined}
            style={{
              width: '100%',
            }}
          ></cx-input>
          <cx-space
            style={{
              justifyContent: 'flex-end',
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
                type="submit"
                style={{
                  width: '100%',
                }}
              >
                {buttonText}
              </cx-button>
            </cx-space>
          </cx-space>
        </cx-space>
      </form>
    </div>
  );
};

export default AuthenticatePage;
