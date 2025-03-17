export const rotateBox = (width: number, height: number, angle: number) => {
  const rad = (angle * Math.PI) / 180;

  const cosTheta = Math.abs(Math.cos(rad));
  const sinTheta = Math.abs(Math.sin(rad));

  const rotatedWidth = width * cosTheta + height * sinTheta;
  const rotatedHeight = width * sinTheta + height * cosTheta;
  return {
    width: rotatedWidth,
    height: rotatedHeight,
  };
};