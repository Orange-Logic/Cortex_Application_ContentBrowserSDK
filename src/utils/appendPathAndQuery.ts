// Insert extra path segments into a URL that may already carry a query string or fragment.
//
// Asset-link transformations live in the URL *path* (`/t/<segments>/<identifier><ext>`), so they must
// be inserted before any query string the base link already has. Links generated under a parameter
// session come back from the server already ending in `?UseSession=<id>`, so appending the segments
// to the raw string pushed the whole transformation into the query value: the path stayed a valid
// link to the untransformed asset and the server silently served the original image (L-428JQO).
//
// Splitting on the first `?`/`#` keeps the segments in the path, preserves the query the base already
// had, and lets caller-supplied parameters replace same-named ones instead of duplicating them.
export const appendPathAndQuery = (
  baseUrl: string,
  pathSuffix: string,
  extraQueryParams: string[] = [],
): string => {
  const questionMarkIndex = baseUrl.indexOf('?');
  const hashIndex = baseUrl.indexOf('#');
  const separatorIndex = [questionMarkIndex, hashIndex]
    .filter((index) => index !== -1)
    .reduce((lowest, index) => (lowest === -1 ? index : Math.min(lowest, index)), -1);

  const path = separatorIndex === -1 ? baseUrl : baseUrl.slice(0, separatorIndex);
  const tail = separatorIndex === -1 ? '' : baseUrl.slice(separatorIndex);

  // Keep any fragment last: new parameters have to land in the query, not after the '#'.
  const tailHashIndex = tail.indexOf('#');
  const fragment = tailHashIndex === -1 ? '' : tail.slice(tailHashIndex);
  const existingQuery = (tailHashIndex === -1 ? tail : tail.slice(0, tailHashIndex)).replace(/^\?/, '');

  const parameterName = (parameter: string) => parameter.split('=')[0].toLowerCase();
  const overriddenNames = new Set(extraQueryParams.map(parameterName));
  const mergedParams = [
    ...existingQuery.split('&').filter((parameter) => parameter
      && !overriddenNames.has(parameterName(parameter))),
    ...extraQueryParams,
  ];

  const query = mergedParams.length > 0 ? `?${mergedParams.join('&')}` : '';

  return `${path}${pathSuffix}${query}${fragment}`;
};
