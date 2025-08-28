import _debounce from 'lodash-es/debounce';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';

import { Unit } from '@/types/assets';
import { FORMAT_DIALOG_PREVIEW_SIZE } from '@/utils/constants';
import { calculateAspectRatioFit, cropImage, resizeImage, rotateImage } from '@/utils/image';

import { Container } from '../Previewer/Previewer.styled';

type Props = {
  disabled: boolean;
  loadable: boolean;
  image: {
    url: string;
    originalUrl: string;
    extension: string;
    width: number;
    height: number;
    x: number;
    y: number;
    rotation: number;
  };
  selectedProxy: string;
  resizer: {
    width: number;
    height: number;
  };
  cropper: {
    width: number;
    height: number;
    percentageWidth: number;
    percentageHeight: number;
    x: number;
    y: number;
    unit: Unit;
  };
  rotation: number;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  onLoadingChange: (loading: boolean) => void;
};

export type CropPreviewerHandle = {
  applyResize: () => Promise<string>;
  applyCrop: () => Promise<string>;
  applyRotation: () => Promise<string>;
  setZoom: (zoom: number) => void;
};

const CropPreviewer = forwardRef<CropPreviewerHandle, Props>(({
  disabled,
  loadable,
  image,
  resizer,
  cropper,
  rotation,
  selectedProxy,
  onCropComplete,
  onLoadingChange,
}, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [resizedImage, setResizedImage] = useState<string>(image?.url ?? '');
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const { url, originalUrl, extension } = image;
    const { width, height } = resizer;
    const resize = async () => {
      if (loadable) {
        onLoadingChange(true);
        const { width: newWidth, height: newHeight } = calculateAspectRatioFit(image.width, image.height, width, height);
        const { url: imageUrl } = await resizeImage(url,
          newWidth,
          newHeight,
          containerRef.current?.clientWidth ?? window.innerWidth, FORMAT_DIALOG_PREVIEW_SIZE,
        );
        setResizedImage(extension === 'gif' ? originalUrl : imageUrl);
        onLoadingChange(false);
      } else {
        setResizedImage(url);
      }
    };
    const debounceResize = _debounce(resize, 300, { leading: true });
    debounceResize();
  }, [image, loadable, onLoadingChange, resizer, selectedProxy]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerDimensions({ width, height });
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const applyResize = useCallback(async () => {
    return resizedImage;
  }, [resizedImage]);

  const applyCrop = useCallback(async () => {
    const { width, height, x, y, unit } = cropper;
    const options = { x, y, width, height };
    options.x = (x / 100) * image.width;
    options.y = (y / 100) * image.height;
    if (loadable) {
      onLoadingChange(true);
      if (unit === Unit.AspectRatio) {
        const { width: newWidth, height: newHeight } = calculateAspectRatioFit(image.width, image.height, width, height);
        options.width = newWidth / zoom;
        options.height = newHeight  / zoom;
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
      return Promise.resolve(image.url);
    }
  }, [cropper, image.width, image.height, image.url, loadable, onLoadingChange, zoom]);

  const applyRotation = useCallback(async () => {
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
      return Promise.resolve(image.url);
    }
  }, [image.height, image.url, image.width, loadable, onLoadingChange, rotation]);

  useImperativeHandle(ref, () => ({
    applyResize,
    applyCrop,
    applyRotation,
    setZoom,
  }));

  const resetCropper = useCallback(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  const onCropChange = useCallback(
    (location: Point) => {
      if (disabled) {
        return;
      }
      setCrop(location);
    },
    [disabled],
  );

  const onMediaLoaded = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    resetCropper();
  }, [disabled, resetCropper]);


  const objectFit = useMemo(() => {
    const container = containerRef.current;
    if (!container || isLoading) {
      return 'contain';
    }
    const imgAspect = resizer.width / resizer.height;

    const clientHeight = containerDimensions.height || FORMAT_DIALOG_PREVIEW_SIZE;
    const containerAspect = containerDimensions.width / clientHeight;

    return imgAspect > containerAspect ? 'horizontal-cover' : 'vertical-cover';
  }, [isLoading, resizer, containerDimensions]);

  return (
    <Container
      ref={containerRef}
      style={{
        height: `${FORMAT_DIALOG_PREVIEW_SIZE}px`,
      }}
    >
      {loadable && (
        <Cropper
          image={resizedImage}
          crop={crop}
          zoom={zoom}
          aspect={cropper.width / cropper.height}
          rotation={rotation}
          objectFit={objectFit}
          onCropChange={onCropChange}
          onCropComplete={onCropComplete}
          onMediaLoaded={onMediaLoaded}
          onZoomChange={setZoom}
          zoomWithScroll={cropper.unit === Unit.AspectRatio}
          style={{
            containerStyle: {
              cursor: disabled ? 'default' : 'move',
              pointerEvents: disabled ? 'none' : 'auto',
            },
            cropAreaStyle: {
              display: disabled ? 'none' : 'block',
            },
            mediaStyle: {
              opacity: isLoading ? 0 : 1,
            },
          }}
        />
      )}
      {isLoading && (
        <div className="loading">
          <cx-skeleton className="loading__skeleton"></cx-skeleton>
          <cx-spinner className="loading__spinner"></cx-spinner>
        </div>
      )}
    </Container>
  );
});

export default CropPreviewer;
