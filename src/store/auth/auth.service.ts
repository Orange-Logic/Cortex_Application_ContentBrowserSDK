import { GetAccessKeyRes, GetAccessTokenRes, RequestAuthorizeRes } from '@/types/auth';
import { cortexFetch } from '@/utils/api';

export const AUTH_MAX_RETRIES = 10;
export const CANCEL_AUTH_MESSAGE = 'Authentication cancelled';

/**
 * Raised when the access-token endpoint could not be reached, or answered with
 * something that is not a well-formed JSON body.
 *
 * This is deliberately distinct from the server answering and declining the key:
 * a decline is a normal 200 response carrying `success: false`, and only that
 * justifies discarding the stored access key. Callers must keep the key when they
 * see this error, or a passing proxy error costs the user a still-valid
 * credential. (42AX2G)
 */
export class AuthTransportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthTransportError';
  }
}

export const authAbortController = { controller: new AbortController() };

export const abortAuthService = () => {
  authAbortController.controller.abort(CANCEL_AUTH_MESSAGE);
  authAbortController.controller = new AbortController();
};

export const requestAuthorizeService = async (
  nonce: string,
): Promise<RequestAuthorizeRes> => {
  const response = await cortexFetch(
    'webapi/extensibility/integrations/gab/authorization/requestauthorize_4bu_v1',
    {
      method: 'POST',
      body: JSON.stringify({ Nonce: nonce }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return { ...(await response.json()), nonce };
};

export const getAccessKeyService = async (
  requestID: string,
): Promise<GetAccessKeyRes> => {
  authAbortController.controller = new AbortController();
  let count = 0;
  let data: GetAccessKeyRes;
  while (count < AUTH_MAX_RETRIES) {
    const response = await cortexFetch(
      'webapi/extensibility/integrations/gab/authorization/getaccesskey_4bv_v1',
      {
        signal: authAbortController.controller.signal,
        method: 'POST',
        body: JSON.stringify({ RequestID: requestID }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    data = await response.json();
    if (!!data.code && data.code !== 'RepeatRequest') {
      return data;
    }
    count++;
  }
  throw new Error('Unable to get Access Key: Max retries exceeded.');
};

export const getAccessTokenService = async (
  accessKey: string,
): Promise<GetAccessTokenRes> => {
  const response = await cortexFetch(
    'webapi/extensibility/integrations/gab/authorization/getaccesstoken_4bt_v1',
    {
      method: 'POST',
      body: JSON.stringify({ AccessKey: accessKey }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  // The endpoint reports a rejected key as 200 + `success: false`, so any non-2xx
  // came from the infrastructure in front of it, not from a verdict on the key.
  if (!response.ok) {
    throw new AuthTransportError(
      `getaccesstoken_4bt_v1 responded with status ${response.status}`,
    );
  }

  try {
    return await response.json() as GetAccessTokenRes;
  } catch {
    // A gateway error page parses as neither JSON nor a verdict.
    throw new AuthTransportError(
      'getaccesstoken_4bt_v1 returned a body that is not JSON',
    );
  }
};
