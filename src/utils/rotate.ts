export const rotateBox = (width: number, height: number, angle: number) => {
  const rad = (angle * Math.PI) / 180;


  // For 90, 180, 270, 360 degrees, the width and height are swapped
  // We do this to avoid floating point precision issues
  if (angle % 90 === 0) {
    return {
      width: angle % 180 === 0 ? width : height,
      height: angle % 180 === 0 ? height : width,
    };
  }

  const cosTheta = Math.abs(Math.cos(rad));
  const sinTheta = Math.abs(Math.sin(rad));

  const rotatedWidth = width * cosTheta + height * sinTheta;
  const rotatedHeight = width * sinTheta + height * cosTheta;
  return {
    width: Math.round(rotatedWidth),
    height: Math.round(rotatedHeight),
  };
};