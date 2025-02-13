/**
 * Create a random alphanumeric string with specific length
 * @param length
 * @returns Empty string if length is negative
 */
export const RandomString = (length: number) => {
  let retval = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    retval += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return retval;
};

/**
 * Check if the given string is null, or empty, or contains only whitespaces
 * @param text
 * @returns
 */
export const IsNullOrWhiteSpace = (text?: string | null) => {
  return !text || text.trim() === '';
};

/**
 * Check if the given string is filled (not null, not undefined, not empty, not whitespace)
 * @param text
 * @returns {boolean}
 */
export const IsStringFilled = (text?: string | null) => {
  return typeof text === 'string' && text.trim() !== '';
};

