export const convertPixelsToAspectRatio = (width: number, height: number) => {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);

  return {
    width: width / divisor,
    height: height / divisor,
  };
};