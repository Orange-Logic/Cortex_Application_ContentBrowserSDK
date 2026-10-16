export const SITE_SESSION_EXPIRED_MESSAGE = 'Your Cortex site session has expired. Sign in to the site and reopen the content browser.';

export const resolveSiteSessionUrl = (baseUrl?: string) => {
  const url = new URL(baseUrl || window.location.origin, window.location.origin);
  if (!['http:', 'https:'].includes(url.protocol) || url.origin !== window.location.origin || url.username || url.password || url.search || url.hash) {
    throw new Error('Site session mode requires an HTTP(S) baseUrl on the current page origin, without credentials, query, or fragment.');
  }
  return url.href.replace(/\/$/, '');
};

export const getSiteSessionRequestUrl = (baseUrl: string, resource: string) => {
  const url = new URL(resource, `${resolveSiteSessionUrl(baseUrl)}/`);
  if (url.origin !== window.location.origin || url.username || url.password) {
    throw new Error('Site session requests must use the current page origin.');
  }
  for (const key of Array.from(url.searchParams.keys())) {
    if (['token', 'usesession'].includes(key.toLowerCase())) {
      url.searchParams.delete(key);
    }
  }
  return url.href;
};
