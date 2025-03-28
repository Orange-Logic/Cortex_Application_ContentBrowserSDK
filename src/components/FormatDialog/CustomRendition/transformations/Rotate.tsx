import _debounce from 'lodash-es/debounce';
import { FormEvent, useEffect, useState } from 'react';

import { CxInput } from '@/web-component';
import { INPUT_DEBOUNCE_DELAY } from '../CustomRendition.constants';

type Props = {
  open: boolean;
  rotation: number;
  onChange: (rotation: number) => void;
  onApply: () => void;
};

const sanitizeRotation = (rotation: number) => {
  if (rotation >= 360) {
    return 359;
  } else if (rotation < 0) {
    return 0;
  }
  return rotation;
};

const Rotate = ({ open, rotation, onChange, onApply }: Props) => {
  const [isDefined, setIsDefined] = useState(false);
  const [invalidRotation, setInvalidRotation] = useState(false);

  useEffect(() => {
    Promise.all([
      customElements.whenDefined('cx-input'),
    ]).then(() => {
      setIsDefined(true);
    });
  }, []);

  const handleRotationChange = _debounce((e: FormEvent<CxInput>) => {
    const value = (e.target as HTMLInputElement).value;
    const newRotation = Number(value);
    if (!value) {
      setInvalidRotation(true);
    } else {
      setInvalidRotation(false);
    }

    // When the user change the value to a number >= 360 for the second time in a row, 
    // The input won't update the value back to 359, so we need to do it manually
    const sanitizedRotation = sanitizeRotation(newRotation);
    if (newRotation >= 360 || newRotation < 0) {
      (e.target as HTMLInputElement).value = sanitizedRotation.toString();
    }
    onChange(sanitizedRotation);
  }, INPUT_DEBOUNCE_DELAY);

  return (
    <cx-details open={open} data-value="rotate">
      <cx-space slot="summary">
        <div className="details__summary__icon">
          <cx-icon name="rotate_90_degrees_cw"></cx-icon>
        </div>
        <cx-typography variant="body2">Rotate</cx-typography>
      </cx-space>
      <cx-space spacing="small">
        <cx-button-group label="History">
          <cx-button
            outline
            onClick={() => onChange(sanitizeRotation(rotation - 90))}
          >
            <cx-icon name="rotate_90_degrees_ccw" label="Undo"></cx-icon>
          </cx-button>
          <cx-button
            outline
            onClick={() => onChange(sanitizeRotation(rotation + 90))}
          >
            <cx-icon name="rotate_90_degrees_cw" label="Redo"></cx-icon>
          </cx-button>
        </cx-button-group>
        <cx-input
          value={isDefined && !invalidRotation ? rotation.toString() : ''}
          placeholder="0"
          type="number"
          style={{
            width: '80px',
            flex: 'none',
          }}
          onInput={handleRotationChange}
          step='1'
        ></cx-input>
        <cx-button
          variant="primary"
          disabled={rotation === 0 || invalidRotation}
          onClick={onApply}
        >
          Apply
        </cx-button>
      </cx-space>
    </cx-details>
  );
};

export default Rotate;