import _debounce from 'lodash-es/debounce';
import { FC, FormEvent, useEffect, useMemo, useRef, useState } from 'react';

import { Unit } from '@/types/assets';
import { calculateAspectRatioFit } from '@/utils/image';
import { CxChangeEvent, CxInput, CxSelect } from '@/web-component';

import { cropModes, INPUT_DEBOUNCE_DELAY } from '../CustomRendition.constants';
type Props = {
  open: boolean;
  width: number;
  height: number;
  disabledCropApply: boolean;
  lastAppliedSetting: Record<Unit, {
    width: number;
    height: number;
    percentageWidth: number;
    percentageHeight: number;
    x: number;
    y: number;
    unit: Unit;
  }>;
  maxWidth: number;
  maxHeight: number;
  percentageWidth: number;
  percentageHeight: number;
  unit: Unit;
  onChange: (
    width: number,
    height: number,
    unit: Unit,
  ) => void;
  onApply: () => void;
};

const Crop: FC<Props> = ({
  open,
  width,
  height,
  disabledCropApply,
  maxWidth,
  maxHeight,
  percentageHeight,
  percentageWidth,
  unit,
  lastAppliedSetting,
  onChange,
  onApply,
}) => {
  const [isDefined, setIsDefined] = useState(false);
  const [mode, setMode] = useState<string>('free');
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [invalidHeight, setInvalidHeight] = useState(false);
  const [invalidWidth, setInvalidWidth] = useState(false);

  const unitSelectRef = useRef<CxSelect>(null);
  const formatSelectRef = useRef<CxSelect>(null);
  const heightInputRef = useRef<CxInput>(null);
  const widthInputRef = useRef<CxInput>(null);

  useEffect(() => {
    setMode('free');
  }, [open]);

  useEffect(() => {
    if (!open) {
      if (heightInputRef.current) {
        heightInputRef.current.value = height.toString();
      }
      if (widthInputRef.current) {
        widthInputRef.current.value = width.toString();
      }
    }
  }, [height, open, width]);

  useEffect(() => {
    Promise.all([
      customElements.whenDefined('cx-input'),
      customElements.whenDefined('cx-select'),
    ]).then(() => {
      setIsDefined(true);
    });
  }, []);

  useEffect(() => {
    const unitSelect = unitSelectRef.current;
    if (!unitSelect || !isDefined) {
      return;
    }
    const onUnitChange = (e: CxChangeEvent) => {
      if ((e.target as HTMLOptionElement).value === Unit.AspectRatio) {
        onChange(lastAppliedSetting[Unit.AspectRatio].width, lastAppliedSetting[Unit.AspectRatio].height, Unit.AspectRatio);
      } else {
        onChange(lastAppliedSetting[Unit.Pixel].width, lastAppliedSetting[Unit.Pixel].height, Unit.Pixel);
      }
      setMode('free');
    };
    unitSelect.addEventListener('cx-change', onUnitChange);

    return () => {
      unitSelect.removeEventListener('cx-change', onUnitChange);
    };
  }, [isDefined, width, height, onChange, maxWidth, maxHeight, percentageWidth, percentageHeight, lastAppliedSetting]);

  useEffect(() => {
    const formatSelect = formatSelectRef.current;
    if (!formatSelect || !isDefined) {
      return;
    }
    const onModeChange = (e: CxChangeEvent) => {
      const value = (e.target as HTMLOptionElement).value;
      if (value === 'free') {
        setKeepAspectRatio(false);
      } else {
        setKeepAspectRatio(true);
        const [widthRatio, heightRatio] = value.split(':').map(Number);
        if (unit === Unit.Pixel) {
          // If image size is 1024x1024 and user selects 16:9, the new size should be 1024x576
          const { width: newWidth, height: newHeight } = calculateAspectRatioFit(maxWidth, maxHeight, widthRatio, heightRatio);
          onChange(newWidth, newHeight, unit);
        } else {
          onChange(widthRatio, heightRatio, unit);
        }
      }
      setMode((e.target as HTMLOptionElement).value);
    };
    formatSelect.addEventListener('cx-change', onModeChange);

    return () => {
      formatSelect.removeEventListener('cx-change', onModeChange);
    };
  }, [isDefined, maxWidth, maxHeight, unit, onChange]);

  const aspectRatio = useMemo(() => {
    return maxWidth / maxHeight;
  }, [maxWidth, maxHeight]);


  const handleWidthChange = _debounce((e: FormEvent<CxInput>) => {
    if (!(e.target as HTMLInputElement).value) {
      setInvalidWidth(true);
      return;
    }
    setInvalidWidth(false);
    const newWidth = Math.max(Math.min(Number((e.target as HTMLInputElement).value), maxWidth), 1);
    (e.target as HTMLInputElement).value = newWidth.toString();
    let newHeight = height;
    if (keepAspectRatio) {
      newHeight = Math.min(Math.round(newWidth / aspectRatio), maxHeight);
      setInvalidHeight(false);
    }
    onChange(newWidth, newHeight, unit);
  }, INPUT_DEBOUNCE_DELAY);

  const handleHeightChange = _debounce((e: FormEvent<CxInput>) => {
    if (!(e.target as HTMLInputElement).value) {
      setInvalidHeight(true);
      return;
    }
    setInvalidHeight(false);
    const newHeight = Math.max(Math.min(Number((e.target as HTMLInputElement).value), maxHeight), 1);
    (e.target as HTMLInputElement).value = newHeight.toString();
    let newWidth = width;
    if (keepAspectRatio) {
      newWidth = Math.min(Math.round(newHeight * aspectRatio), maxWidth);
      setInvalidWidth(false);
    }
    onChange(newWidth, newHeight, unit);
  }, INPUT_DEBOUNCE_DELAY);

  return (
    <cx-details open={open} data-value="crop">
      <cx-space slot="summary" align-items='center'>
        <div className="details__summary__icon">
          <cx-icon name="crop"></cx-icon>
        </div>
        <cx-typography variant="body2">Crop</cx-typography>
      </cx-space>
      <cx-space direction="vertical" spacing="small">
        <cx-select
          ref={formatSelectRef}
          value={isDefined ? mode : ''}
          hoist
          style={{
            width: '100%',
          }}
        >
          {cropModes.map(({ value, label }) => (
            <cx-option key={value} value={value}>{label}</cx-option>
          ))}
        </cx-select>
        <cx-space spacing="small">
          <div className="resize__input-group">
            <cx-input
              ref={widthInputRef}
              placeholder="Width"
              type="number"
              step="1"
              value={isDefined ? width.toString() : ''}
              onInput={handleWidthChange}
              required
            >
              <cx-typography slot="prefix" variant="body3" className="details__summary__input-label">W</cx-typography>
            </cx-input>
            <cx-icon-button
              name={keepAspectRatio ? 'insert_link' : 'link_off'}
              onClick={() => {
                if (keepAspectRatio) {
                  setMode('free');
                }
                setKeepAspectRatio(!keepAspectRatio);
              }}
              style={{
                color: keepAspectRatio ? 'var(--cx-color-primary)' : undefined,
              }}
            ></cx-icon-button>
            <cx-input
              ref={heightInputRef}
              placeholder="Height"
              type="number"
              step="1"
              value={isDefined ? height.toString() : ''}
              onInput={handleHeightChange}
              required
            >
              <cx-typography slot="prefix" variant="body3" className="details__summary__input-label">H</cx-typography>
            </cx-input>
          </div>
          <cx-select value={isDefined ? unit : ''} ref={unitSelectRef} hoist>
            <cx-option value="pixels">Pixels</cx-option>
            <cx-option value="aspect-ratio">Aspect ratio</cx-option>
          </cx-select>
        </cx-space>
        <cx-button
          variant="primary"
          disabled={disabledCropApply || invalidHeight || invalidWidth}
          style={{
            marginLeft: 'auto',
          }}
          onClick={onApply}
        >
          Apply
        </cx-button>
      </cx-space>
    </cx-details>
  );
};

export default Crop;