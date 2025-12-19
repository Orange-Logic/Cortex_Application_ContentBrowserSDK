import { Transformation, TransformationAction, Unit } from '@/types/assets';
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

        if (ratio > 0) {
          canvas.width = width * ratio;
          canvas.height = height * ratio;
        } else {
          canvas.width = width;
          canvas.height = height;
        }
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

export const getCroppedImageUrl = async ({
  cropper,
  image,
  loadable,
  onLoadingChange,
  zoom,
}: {
  cropper: {
    width: number;
    height: number;
    percentageWidth: number;
    percentageHeight: number;
    x: number;
    y: number;
    unit: Unit;
  };
  image: {
    url: string;
    width: number;
    height: number;
  };
  loadable: boolean;
  onLoadingChange: (loading: boolean) => void;
  zoom: number;
}) => {
  const { width, height, x, y, unit } = cropper;
  const options = { x, y, width, height };
  options.x = (x / 100) * image.width;
  options.y = (y / 100) * image.height;
  if (loadable) {
    onLoadingChange(true);
    if (unit === Unit.AspectRatio) {
      const { width: newWidth, height: newHeight } = calculateAspectRatioFit(
        image.width,
        image.height,
        width,
        height,
      );
      options.width = newWidth / zoom;
      options.height = newHeight / zoom;
    }
    const result = await cropImage(
      {
        url: image.url,
        width: image.width,
        height: image.height,
      },
      options,
    );
    onLoadingChange(false);
    return result;
  } else {
    return image.url;
  }
};

export const getRotatedImageUrl = async (
  {
    image,
    loadable,
    onLoadingChange,
    rotation,
  }:
  { image: {
    url: string;
    width: number;
    height: number;
  },
  loadable: boolean,
  onLoadingChange: (loading: boolean) => void,
  rotation: number, },
) : Promise<string> => {
  if (loadable) {
    onLoadingChange(true);
    const result = await rotateImage(
      {
        url: image.url,
        width: image.width,
        height: image.height,
      },
      rotation,
    );
    onLoadingChange(false);
    return result;
  } else {
    return image.url;
  }
};

export const transformImage = ({
  width,
  height,
  transformations,
}: {
  width: number;
  height: number;
  transformations: Transformation[];
}) => {
  /**
   * Process transformations in order to handle interleaved crop, resize, and rotation steps.
   * When a 90° or 270° rotation occurs, the image dimensions are swapped, so subsequent
   * crop percentages need to be transformed back to the original orientation.
   * Resize steps change the effective dimensions without affecting crop percentages of original.
   */
  let cumulativeRotation = 0;
  let percentageWidth = 100;
  let percentageHeight = 100;
  let percentageX = 0;
  let percentageY = 0;

  let effectiveWidth = width;
  let effectiveHeight = height;

  let dimensionsSwapped = false;

  for (const transformation of transformations) {
    if (transformation.key === TransformationAction.Rotate) {
      const stepRotation = transformation.value?.rotation ?? 0;
      cumulativeRotation = (cumulativeRotation + stepRotation) % 360;

      if (stepRotation % 180 !== 0 && stepRotation % 90 === 0) {
        dimensionsSwapped = !dimensionsSwapped;
        /**
         * Swap effective dimensions to match current orientation
         */
        [effectiveWidth, effectiveHeight] = [effectiveHeight, effectiveWidth];
      }
    } else if (transformation.key === TransformationAction.Crop) {
      /**
       * Get crop parameters in the current (potentially rotated) coordinate space
       */
      const rotX = transformation.value?.percentageX ?? 0;
      const rotY = transformation.value?.percentageY ?? 0;
      const rotW = transformation.value?.percentageWidth ?? 100;
      const rotH = transformation.value?.percentageHeight ?? 100;

      /*
       * Transform crop coordinates back to original orientation
       * based on cumulative rotation.
       *
       * - 90° CW:
       *   Rotated (x, y) with size (w, h)
       *   → Original (y, 100 - x - w) with size (h, w)
       *
       * - 180°:
       *   Rotated (x, y)
       *   → Original (100 - x - w, 100 - y - h)
       *   with same size
       *
       * - 270° CW:
       *   Rotated (x, y)
       *   → Original (100 - y - h, x) with size (h, w)
       */
      let cropOrigX: number,
        cropOrigY: number,
        cropOrigW: number,
        cropOrigH: number;

      switch (cumulativeRotation) {
        case 90:
          cropOrigX = rotY;
          cropOrigY = 100 - rotX - rotW;
          cropOrigW = rotH;
          cropOrigH = rotW;
          break;
        case 180:
          cropOrigX = 100 - rotX - rotW;
          cropOrigY = 100 - rotY - rotH;
          cropOrigW = rotW;
          cropOrigH = rotH;
          break;
        case 270:
          cropOrigX = 100 - rotY - rotH;
          cropOrigY = rotX;
          cropOrigW = rotH;
          cropOrigH = rotW;
          break;
        default: // 0 or 360
          cropOrigX = rotX;
          cropOrigY = rotY;
          cropOrigW = rotW;
          cropOrigH = rotH;
      }

      /**
       * Compound the crop relative to the current crop region
       */
      percentageX += (cropOrigX * percentageWidth) / 100;
      percentageY += (cropOrigY * percentageHeight) / 100;
      percentageWidth = (percentageWidth * cropOrigW) / 100;
      percentageHeight = (percentageHeight * cropOrigH) / 100;

      effectiveWidth = (effectiveWidth * rotW) / 100;
      effectiveHeight = (effectiveHeight * rotH) / 100;
    } else if (transformation.key === TransformationAction.Resize) {
      /**
       * Resize step's width/height are relative to the format's dimensions at that point.
       * We need to calculate scale factors based on the original format dimensions
       * and apply them to the current effective dimensions.
       * 
       * For example: if format was 40px and resized to 20px (50%), and the actual
       * image width is 4000px, the effective width should be 2000px (4000 * 0.5).
       */
      const resizeWidth = transformation.value?.width ?? effectiveWidth;
      const resizeHeight = transformation.value?.height ?? effectiveHeight;
      const originalWidth = transformation.value?.originalWidth ?? resizeWidth;
      const originalHeight = transformation.value?.originalHeight ?? resizeHeight;

      // Calculate scale factors based on the format's dimensions before and after resize
      const scaleW = resizeWidth / originalWidth;
      const scaleH = resizeHeight / originalHeight;

      // Apply scale factors to current effective dimensions
      effectiveWidth = effectiveWidth * scaleW;
      effectiveHeight = effectiveHeight * scaleH;
    }
  }

  /**
   * Swap effective dimensions back to original orientation for final calculation
   * (rotateBox will be applied at the end to get final rotated dimensions)
   */
  if (dimensionsSwapped) {
    [effectiveWidth, effectiveHeight] = [effectiveHeight, effectiveWidth];
  }

  const totalRotation = transformations.reduce((acc, transformation) => {
    if (transformation.key === TransformationAction.Rotate) {
      acc += transformation.value?.rotation ?? 0;
    }
    return acc;
  }, 0);
  const rotation = totalRotation % 360;

  const croppedWidth = width * (percentageWidth / 100);
  const croppedHeight = height * (percentageHeight / 100);

  return {
    rotation,
    croppedWidth: Math.round(croppedWidth),
    croppedHeight: Math.round(croppedHeight),
    percentageWidth,
    percentageHeight,
    percentageX,
    percentageY,
    effectiveWidth: Math.round(effectiveWidth),
    effectiveHeight: Math.round(effectiveHeight),
  };
};