export type AuthorizationResult = {
  requestID: string;
};

export enum GetAccessKeyResponseCode {
  Authorized = 'Authorized',
  RepeatRequest = 'RepeatRequest',
  NotAuthorized = 'NotAuthorized',
}

export type GetAccessKeyResponse = {
  code: GetAccessKeyResponseCode;
  accessKey?: string;
  message?: string;
};

export type GetAccessTokenResponse = {
  success: boolean;
  accessToken?: string;
};

export type RequestAuthorizeRes = {
  requestID: string;
  nonce: string;
};

export type GetAccessKeyRes = {
  code: GetAccessKeyResponseCode;
  accessKey?: string;
  message?: string;
};

export type GetAccessTokenRes = {
  success: boolean;
  accessToken?: string;
};

export type OAuthRes = {
  accessToken?: string;
  accessKey?: string;
  siteUrl: string;
};
