import _isEqual from 'lodash-es/isEqual';
import { FC, useEffect, useMemo, useRef } from 'react';

import { Unit } from '@/types/assets';
import { CxHideEvent, CxShowEvent } from '@/web-component';

import { Container } from './CustomRendition.styled';
import { Crop, Extension, Resize, Rotate } from './transformations';

type Props = {
  activeSetting: string;
  imageSize: {
    width: number;
    height: number;
  }
  resize: {
    width: number;
    height: number;
    unit: Unit;
  };
  crop: {
    width: number;
    height: number;
    unit: Unit;
    percentageWidth: number;
    percentageHeight: number;
  };
  extension: string;
  lastAppliedResize: {
    width: number;
    height: number;
    unit: Unit;
  };
  lastAppliedCrop: {
    width: number;
    height: number;
    unit: Unit;
  };
  rotation: number;
  onResizeChange: (
    width: number,
    height: number,
    unit: Unit,
    shouldApply: boolean
  ) => void;
  onCropChange: (
    width: number,
    height: number,
    unit: Unit,
    shouldApply: boolean
  ) => void;
  onRotateChange: (rotation: number, shouldApply: boolean) => void;
  onExtensionChange: (extension: string) => void;
  onViewChange: (view: string) => void;
};

const CustomRendition: FC<Props> = ({
  activeSetting,
  imageSize,
  resize,
  crop,
  extension,
  lastAppliedCrop,
  lastAppliedResize,
  rotation,
  onResizeChange,
  onCropChange,
  onRotateChange,
  onExtensionChange,
  onViewChange,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) { return; }

    const onDetailsShow = (e: CxShowEvent) => {
      if ((e.target as HTMLElement).localName === 'cx-details') {
        onViewChange((e.target as HTMLElement).dataset.value ?? '');
      }
    };
    const onDetailsHide = (e: CxHideEvent) => {
      const allDetails = container?.querySelectorAll('cx-details');

      if ((e.target as HTMLElement).localName === 'cx-details') {
        const allDetailsClosed = Array.from(allDetails).every((details) => {
          if (details.open) {
            return false;
          }
          return true;
        });

        if (allDetailsClosed) {
          onViewChange('');
        }
      }
    };
    container.addEventListener('cx-show', onDetailsShow);
    container.addEventListener('cx-hide', onDetailsHide);

    return () => {
      container.removeEventListener('cx-show', onDetailsShow);
      container.removeEventListener('cx-hide', onDetailsHide);
    };
  }, [onViewChange]);

  const disabledCropApply = useMemo(() => {
    return _isEqual(crop, lastAppliedCrop);
  }, [crop, lastAppliedCrop]);

  return (
    <Container ref={containerRef}>
      <Crop
        open={activeSetting === 'crop'}
        width={crop.width}
        height={crop.height}
        percentageWidth={crop.percentageWidth}
        percentageHeight={crop.percentageHeight}
        disabledCropApply={disabledCropApply}
        maxWidth={resize.width}
        maxHeight={resize.height}
        unit={crop.unit}
        onChange={(width, height, unit) => onCropChange(width, height, unit, false)}
        onApply={() => onCropChange(crop.width, crop.height, crop.unit, true)}
      />
      <Resize
        open={activeSetting === 'resize'}
        width={resize.width}
        height={resize.height}
        lastAppliedSetting={lastAppliedResize}
        maxWidth={imageSize.width}
        maxHeight={imageSize.height}
        unit={resize.unit}
        onChange={(width, height, unit) => onResizeChange(width, height, unit, false)}
        onApply={() => onResizeChange(resize.width, resize.height, resize.unit, true)}
      />
      <Rotate
        open={activeSetting === 'rotate'}
        rotation={rotation}
        onChange={(newRotation) => onRotateChange(newRotation, false)}
        onApply={() => onRotateChange(rotation, true)}
      />
      <Extension extension={extension} onChange={onExtensionChange} />
    </Container>
  );
};

export default CustomRendition;
