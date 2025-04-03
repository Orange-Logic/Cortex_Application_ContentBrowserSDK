import _debounce from 'lodash-es/debounce';
import { FC, FormEvent, useEffect, useMemo, useRef, useState } from 'react';

import { Unit } from '@/types/assets';
import { CxChangeEvent, CxInput, CxSelect } from '@/web-component';
import { INPUT_DEBOUNCE_DELAY } from '../CustomRendition.constants';

type Props = {
  open: boolean;
  width: number;
  height: number;
  lastAppliedSetting: Record<Unit, {
    width: number;
    height: number;
  }>;
  maxWidth: number;
  maxHeight: number;
  unit: Unit;
  onChange: (
    width: number,
    height: number,
    unit: Unit
  ) => void;
  onApply: () => void;
};

const Resize: FC<Props> = ({ open, width, height, lastAppliedSetting, maxWidth, maxHeight, unit, onChange, onApply }) => {
  const [isDefined, setIsDefined] = useState(false);
  const [invalidHeight, setInvalidHeight] = useState(false);
  const [invalidWidth, setInvalidWidth] = useState(false);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const unitSelectRef = useRef<CxSelect>(null);
  const heightInputRef = useRef<CxInput>(null);
  const widthInputRef = useRef<CxInput>(null);

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
    };
    unitSelect.addEventListener('cx-change', onUnitChange);

    return () => {
      unitSelect.removeEventListener('cx-change', onUnitChange);
    };
  }, [isDefined, width, height, onChange, lastAppliedSetting, unit]);

  const aspectRatio = useMemo(() => {
    return maxWidth / maxHeight;
  }, [maxWidth, maxHeight]);

  const disabledApplyButton = useMemo(() => {
    return (lastAppliedSetting[unit].width === width && lastAppliedSetting[unit].height === height);
  }, [lastAppliedSetting, unit, width, height]);

  const handleWidthChange = _debounce((e: FormEvent<CxInput>) => {
    if (!(e.target as HTMLInputElement).value) {
      setInvalidWidth(true);
      return;
    }
    setInvalidWidth(false);
    const newWidth = Math.max(Number((e.target as HTMLInputElement).value), 1);
    (e.target as HTMLInputElement).value = newWidth.toString();
    let newHeight = height;
    if (keepAspectRatio) {
      newHeight = Math.round(newWidth / aspectRatio);
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
    const newHeight = Math.max(Number((e.target as HTMLInputElement).value), 1);
    (e.target as HTMLInputElement).value = newHeight.toString();
    let newWidth = width;
    if (keepAspectRatio) {
      newWidth = Math.round(newHeight * aspectRatio);
      setInvalidWidth(false);
    }
    onChange(newWidth, newHeight, unit);
  }, INPUT_DEBOUNCE_DELAY);

  return (
    <cx-details open={open} data-value="resize" className="resize">
      <cx-space slot="summary" align-items='center'>
        <div className="details__summary__icon">
          <cx-icon name="aspect_ratio"></cx-icon>
        </div>
        <cx-typography variant="body2">Resize</cx-typography>
      </cx-space>
      <cx-space direction="vertical" spacing="small">
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
              onClick={() => setKeepAspectRatio(prevState => !prevState)}
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
          disabled={disabledApplyButton || invalidHeight || invalidWidth}
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

export default Resize;