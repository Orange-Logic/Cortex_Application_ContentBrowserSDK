import _debounce from 'lodash-es/debounce';
import { CxInput } from '@/web-component';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { INPUT_DEBOUNCE_DELAY } from '../CustomRendition.constants';

type Props = {
  open: boolean;
  quality: number;
  onChange: (quality: number) => void;
};

const Quality = ({ open, quality, onChange }: Props) => {
  const [isDefined, setIsDefined] = useState(false);
  const [value, setValue] = useState(quality);
  const [invalidQuality, setInvalidQuality] = useState(false);

  const inputRef = useRef<CxInput | null>(null);

  useEffect(() => {
    Promise.all([customElements.whenDefined('cx-input')]).then(() => {
      setIsDefined(true);
    });
  }, []);

  useEffect(() => {
    if (isDefined) {
      setValue(quality);
      setInvalidQuality(false);
      if (inputRef.current) {
        inputRef.current.value = quality.toString();
      }
    }
  }, [quality, isDefined]);

  const handleQualityChange = _debounce((e: FormEvent<CxInput>) => {
    const newValue = (e.target as HTMLInputElement).value;
    const newQuality = Number(newValue);
    if (!newValue || isNaN(newQuality) || newQuality < 0 || newQuality > 100) {
      setInvalidQuality(true);
    } else {
      setInvalidQuality(false);
    }

    setValue(newQuality);
  }, INPUT_DEBOUNCE_DELAY);

  return (
    <cx-details open={open} data-value="quality">
      <cx-space slot="summary" align-items="center">
        <div className="details__summary__icon">
          <cx-icon name="blur_on"></cx-icon>
        </div>
        <cx-typography variant="body3">Quality</cx-typography>
      </cx-space>
      <cx-space spacing="small">
        <cx-tooltip
          content="From 1 to 100. 1 = Worst. 100 = Best. Supported Image Formats: JPG, JPEG."
          hoist
        >
          <cx-input
            ref={inputRef}
            class="details__checkbox"
            disabled={!isDefined}
            type="number"
            value={isDefined ? value.toString() : ''}
            min="0"
            max="100"
            step="1"
            onInput={handleQualityChange}
          >
            Preserve metadata
          </cx-input>
        </cx-tooltip>
        <cx-button
          variant="primary"
          disabled={invalidQuality || quality === value}
          onClick={() => {
            onChange(value);
          }}
        >
          Apply
        </cx-button>
      </cx-space>
    </cx-details>
  );
};

export default Quality;
