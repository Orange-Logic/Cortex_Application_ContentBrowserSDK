import _isEqualWith from 'lodash-es/isEqualWith';
import { FC, useEffect, useMemo, useRef } from 'react';

import { Unit } from '@/types/assets';
import { CxHideEvent, CxShowEvent } from '@/web-component';

import { Container } from './CustomRendition.styled';
import { Crop, Extension, Format, Metadata, Quality, Resize, Rotate } from './transformations';
import { Proxy } from '@/types/search';

type Props = {
  activeSetting: string;
  extensions: { displayName: string; value: string }[];
  availableProxies: Proxy[];
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
  keepMetadata: boolean;
  lastAppliedResize: Record<Unit, {
    width: number;
    height: number;
    unit: Unit;
  }>;
  lastAppliedCrop: Record<Unit, {
    width: number;
    height: number;
    percentageWidth: number;
    percentageHeight: number;
    x: number;
    y: number;
    unit: Unit;
  }>;
  proxy: string;
  quality: number;
  rotation: number;
  onCropChange: (
    width: number,
    height: number,
    unit: Unit,
    shouldApply: boolean
  ) => void;
  onExtensionChange: (extension: string) => void;
  onFormatChange: (format: Proxy) => void;
  onKeepMetadataChange: (keepMetadata: boolean) => void;
  onQualityChange: (quality: number) => void;
  onResizeChange: (
    width: number,
    height: number,
    unit: Unit,
    shouldApply: boolean
  ) => void;
  onRotateChange: (rotation: number, shouldApply: boolean) => void;
  onViewChange: (view: string) => void;
};

const CustomRendition: FC<Props> = ({
  activeSetting,
  extensions,
  availableProxies,
  imageSize,
  resize,
  crop,
  extension,
  keepMetadata,
  lastAppliedCrop,
  lastAppliedResize,
  proxy,
  quality,
  rotation,
  onCropChange,
  onExtensionChange,
  onFormatChange,
  onKeepMetadataChange,
  onQualityChange,
  onResizeChange,
  onRotateChange,
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
    return _isEqualWith(crop, lastAppliedCrop[crop.unit], (a, b) => {
      if (!isNaN(a) && !isNaN(b)) {
        return Math.round(a) === Math.round(b);
      }
      return undefined;
    });
  }, [crop, lastAppliedCrop]);

  const formats = useMemo(() => {
    return availableProxies.filter(item => !item.cdnName);
  }, [availableProxies]);
  
  return (
    <Container ref={containerRef}>
      <Format
        open={activeSetting === 'format'}
        format={proxy}
        formats={formats}
        onApply={onFormatChange}
      />
      <Crop
        open={activeSetting === 'crop'}
        width={crop.width}
        height={crop.height}
        percentageWidth={crop.percentageWidth}
        percentageHeight={crop.percentageHeight}
        disabledCropApply={disabledCropApply}
        lastAppliedSetting={lastAppliedCrop}
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
      <Quality
        open={activeSetting === 'quality'}
        quality={quality}
        onChange={onQualityChange}
      />
      <Metadata
        open={activeSetting === 'metadata'}
        keepMetadata={keepMetadata}
        onChange={onKeepMetadataChange}
      />
      <Extension extension={extension} extensions={extensions} onChange={onExtensionChange} />
    </Container>
  );
};

export default CustomRendition;
