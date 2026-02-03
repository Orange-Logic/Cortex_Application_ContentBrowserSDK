// Merge the request path with the correct host URL
export const getRequestUrl = (hostUrl: string, path: string, token?: string) => {
  if (!hostUrl.endsWith('/')) {
    hostUrl += '/';
  }
  const url = new URL(path, hostUrl);
  if (token) {
    if (!url.searchParams.get('Token')) {
      url.searchParams.append('Token', token);
    } else {
      url.searchParams.set('Token', token);
    }
  }
  return url.href;
};