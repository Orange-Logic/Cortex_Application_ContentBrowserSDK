import _debounce from 'lodash-es/debounce';
import { FormEvent, useEffect, useState } from 'react';

import { DEBOUNCE_DELAY } from '@/components/ControlBar/ControlBar.constants';
import { CxInput } from '@/web-component';

type Props = {
  open: boolean;
  rotation: number;
  onChange: (rotation: number) => void;
  onApply: () => void;
};

const sanitizeRotation = (rotation: number) => {
  if (rotation >= 360) {
    return rotation - 360;
  } else if (rotation < 0) {
    return 360 + rotation;
  }
  return rotation;
};

const Rotate = ({ open, rotation, onChange, onApply }: Props) => {
  const [isDefined, setIsDefined] = useState(false);

  useEffect(() => {
    Promise.all([
      customElements.whenDefined('cx-input'),
    ]).then(() => {
      setIsDefined(true);
    });
  }, []);

  const handleRotationChange = _debounce((e: FormEvent<CxInput>) => {
    const newRotation = Number((e.target as HTMLInputElement).value);
    onChange(sanitizeRotation(newRotation));
  }, DEBOUNCE_DELAY);

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
          value={isDefined ? rotation.toString() : ''}
          placeholder="0"
          type="number"
          style={{
            width: '80px',
            flex: 'none',
          }}
          onInput={handleRotationChange}
        ></cx-input>
        <cx-button
          variant="primary"
          onClick={onApply}
        >
          Apply
        </cx-button>
      </cx-space>
    </cx-details>
  );
};

export default Rotate;