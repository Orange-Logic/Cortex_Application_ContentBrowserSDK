export type AuthorizationResult = {
  requestID: string;
};

export enum GetAccessKeyResponseCode {
  Authorized = 'Authorized',
  RepeatRequest = 'RepeatRequest',
  NotAuthorized = 'NotAuthorized',
}

export type GetAccessKeyResponse = {
  accessKey?: string;
  code: GetAccessKeyResponseCode;
  message?: string;
};

export type GetAccessTokenResponse = {
  accessToken?: string;
  success: boolean;
};

export type RequestAuthorizeRes = {
  nonce: string;
  requestID: string;
};

export type GetAccessKeyRes = {
  accessKey?: string;
  code: GetAccessKeyResponseCode;
  message?: string;
};

export type GetAccessTokenRes = {
  accessToken?: string;
  success: boolean;
};

export type OAuthRes = {
  accessKey?: string;
  accessToken?: string;
  siteUrl: string;
};
