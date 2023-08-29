import {
  GetAccessKeyRes,
  GetAccessTokenRes,
  RequestAuthorizeRes,
} from '../../types/auth';
import { getRequestUrl } from '../../utils/getRequestUrl';

export const AUTH_MAX_RETRIES = 10;
// Public the abort controller for getaccesskey
let abortGetAccessKeyController = new AbortController();
export { abortGetAccessKeyController };

export const requestAuthorizeService = async (
  baseUrl: string,
  nonce: string,
): Promise<RequestAuthorizeRes> => {
  const response = await fetch(
    getRequestUrl(
      baseUrl,
      'webapi/extensibility/integrations/gab/authorization/requestauthorize_4bu_v1',
    ),
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
  baseUrl: string,
  requestID: string,
): Promise<GetAccessKeyRes> => {
  abortGetAccessKeyController = new AbortController();
  let count = 0;
  let data: GetAccessKeyRes;
  while (count < AUTH_MAX_RETRIES) {
    const response = await fetch(
      getRequestUrl(
        baseUrl,
        'webapi/extensibility/integrations/gab/authorization/getaccesskey_4bv_v1',
      ),
      {
        signal: abortGetAccessKeyController.signal,
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
  baseUrl: string,
  accessKey: string,
): Promise<GetAccessTokenRes> => {
  const response = await fetch(
    getRequestUrl(
      baseUrl,
      'webapi/extensibility/integrations/gab/authorization/getaccesstoken_4bt_v1',
    ),
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
