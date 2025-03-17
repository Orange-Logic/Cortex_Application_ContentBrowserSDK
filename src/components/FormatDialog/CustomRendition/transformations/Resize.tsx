import _debounce from 'lodash-es/debounce';
import { FC, FormEvent, useEffect, useMemo, useRef, useState } from 'react';

import { DEBOUNCE_DELAY } from '@/components/ControlBar/ControlBar.constants';
import { Unit } from '@/types/assets';
import { convertPixelsToAspectRatio } from '@/utils/number';
import { CxChangeEvent, CxInput, CxSelect } from '@/web-component';

type Props = {
  open: boolean;
  width: number;
  height: number;
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

const Resize: FC<Props> = ({ open, width, height, maxWidth, maxHeight, unit, onChange, onApply }) => {
  const [isDefined, setIsDefined] = useState(false);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const unitSelectRef = useRef<CxSelect>(null);

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
        const { width: newWidth, height: newHeight } =
          convertPixelsToAspectRatio(width, height);
        onChange(newWidth, newHeight, Unit.AspectRatio);
      } else {
        onChange(width, height, Unit.Pixel);
      }
    };
    unitSelect.addEventListener('cx-change', onUnitChange);

    return () => {
      unitSelect.removeEventListener('cx-change', onUnitChange);
    };
  }, [isDefined, width, height, onChange]);

  const aspectRatio = useMemo(() => {
    return maxWidth / maxHeight;
  }, [maxWidth, maxHeight]);

  const handleWidthChange = _debounce((e: FormEvent<CxInput>) => {
    const newWidth = Math.max(Number((e.target as HTMLInputElement).value), 1);
    (e.target as HTMLInputElement).value = newWidth.toString();
    let newHeight = height;
    if (keepAspectRatio) {
      newHeight = Math.round(newWidth / aspectRatio * 100) / 100;
    }
    onChange(newWidth, newHeight, unit);
  }, DEBOUNCE_DELAY);

  const handleHeightChange = _debounce((e: FormEvent<CxInput>) => {
    const newHeight = Math.max(Number((e.target as HTMLInputElement).value), 1);
    (e.target as HTMLInputElement).value = newHeight.toString();
    let newWidth = width;
    if (keepAspectRatio) {
      newWidth = Math.round(newHeight * aspectRatio * 100) / 100;
    }
    onChange(newWidth, newHeight, unit);
  }, DEBOUNCE_DELAY);

  return (
    <cx-details open={open} data-value="resize" className="resize">
      <cx-space slot="summary">
        <div className="details__summary__icon">
          <cx-icon name="aspect_ratio"></cx-icon>
        </div>
        <cx-typography variant="body2">Resize</cx-typography>
      </cx-space>
      <cx-space direction="vertical" spacing="small">
        <cx-space spacing="small">
          <div className="resize__input-group">
            <cx-input
              placeholder="Width"
              type="number"
              step="0.01"
              value={isDefined ? width.toString() : ''}
              onInput={handleWidthChange}
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
              placeholder="Height"
              type="number"
              step="0.01"
              value={isDefined ? height.toString() : ''}
              onInput={handleHeightChange}
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