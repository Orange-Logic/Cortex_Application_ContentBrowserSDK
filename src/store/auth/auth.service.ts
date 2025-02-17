import { GetAccessKeyRes, GetAccessTokenRes, RequestAuthorizeRes } from '@/types/auth';
import { cortexFetch } from '@/utils/api';

export const AUTH_MAX_RETRIES = 10;
export const CANCEL_AUTH_MESSAGE = 'Authentication cancelled';

export let authAbortController = new AbortController();

export const abortAuthService = () => {
  authAbortController.abort(CANCEL_AUTH_MESSAGE);
  authAbortController = new AbortController();
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
  authAbortController = new AbortController();
  let count = 0;
  let data: GetAccessKeyRes;
  while (count < AUTH_MAX_RETRIES) {
    const response = await cortexFetch(
      'webapi/extensibility/integrations/gab/authorization/getaccesskey_4bv_v1',
      {
        signal: authAbortController.signal,
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
  return response.json();
};
