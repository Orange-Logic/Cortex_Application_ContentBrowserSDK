import { rotateBox } from './rotate';

export const resizeImage = (
  image: string,
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
): Promise<{
  url: string;
  width: number;
  height: number;
}> => {
  const img = new Image();
  img.src = image;
  img.crossOrigin = 'anonymous';

  return new Promise<{
    url: string;
    width: number;
    height: number;
  }>((resolve) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      if (width > maxWidth || height > maxHeight) {
        const widthRatio = maxWidth / width;
        const heightRatio = maxHeight / height;
        const ratio = Math.min(widthRatio, heightRatio);

        canvas.width = width * ratio;
        canvas.height = height * ratio;
      } else {
        canvas.width = width;
        canvas.height = height;
      }

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve({
          url: canvas.toDataURL('image/jpeg'),
          width: canvas.width,
          height: canvas.height,
        });
      } else {
        resolve({
          url: image,
          width,
          height,
        });
      }
    };

    img.onerror = () => {
      resolve({
        url: image,
        width,
        height,
      });
    };
  });
};

export const cropImage = (
  image: {
    url: string;
    width: number;
    height: number;
  },
  options: { x: number; y: number; width: number; height: number },
): Promise<string> => {
  const img = new Image();
  img.src = image.url;
  img.crossOrigin = 'anonymous';

  return new Promise<string>((resolve) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = options.width;
      canvas.height = options.height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, -options.x, -options.y, image.width, image.height);
        resolve(canvas.toDataURL('image/jpeg'));
      } else {
        resolve(image.url);
      }
    };

    img.onerror = () => {
      resolve(image.url);
    };
  });
};

export const rotateImage = (
  image: {
    url: string;
    width: number;
    height: number;
  },
  rotate: number,
) : Promise<string> => {
  const img = new Image();
  img.src = image.url;
  img.crossOrigin = 'anonymous';

  return new Promise<string>((resolve) => {
    img.onload = () => {
      const { width, height } = rotateBox(image.width, image.height, rotate);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        ctx.translate(width / 2, height / 2);
        ctx.rotate((rotate * Math.PI) / 180);
        ctx.drawImage(img, -image.width / 2, -image.height / 2, image.width, image.height);
        ctx.rotate(-(rotate * Math.PI) / 180);
        ctx.translate(-width / 2, -height / 2);
        resolve(canvas.toDataURL('image/jpeg'));
      } else {
        resolve(image.url);
      }
    };

    img.onerror = () => {
      resolve(image.url);
    };
  });
};

export const calculateAspectRatioFit = (
  srcWidth: number,
  srcHeight: number,
  desiredWidth: number,
  desiredHeight: number,
) => {
  const aspectRatio = srcWidth / srcHeight;
  const newAspectRatio = desiredWidth / desiredHeight;
  let newWidth = srcWidth;
  let newHeight = srcHeight;
  if (aspectRatio > newAspectRatio) {
    newWidth = Math.round(newHeight * newAspectRatio);
  } else {
    newHeight = Math.round(newWidth / newAspectRatio);
  }

  return {
    width: newWidth,
    height: newHeight,
  };
};