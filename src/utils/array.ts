/**
 * Get unique element of an array
 * @param ar 
 * @returns 
 */
export const UniqueArray = <T>(ar: T[], mapCb?: (arg0: T) => string) => {
  const j: { [key: string]: T } = {};

  ar.forEach((v) => {
    const key = typeof mapCb === 'function' ? mapCb(v) : (v + '::' + typeof v);
    j[key] = v;
  });

  return Object.keys(j).map((v) => {
    return j[v];
  });
};

/**
 * Check if Array Object has any element. This will also validate for null and undefined
 * @param {Object | undefined | null} object Array or Object work fine
 * @returns {boolean}
 */
export const HasElements = (object: object | undefined | null) => {
  return object !== null && object !== undefined && Object.keys(object).length > 0;
};