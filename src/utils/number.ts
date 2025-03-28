export const convertPixelsToAspectRatio = (width: number, height: number) => {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const roundedWidth = Math.round(width);
  const roundedHeight = Math.round(height);
  const divisor = gcd(roundedWidth, roundedHeight);

  return {
    width: roundedWidth / divisor,
    height: roundedHeight / divisor,
  };
};