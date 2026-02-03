import type { CxChangeEvent, CxCheckbox } from '@orangelogic/design-system';
import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  open: boolean;
  keepMetadata: boolean;
  onChange: (keepMetadata: boolean) => void;
};

const Metadata = ({ open, keepMetadata, onChange }: Props) => {
  const [isDefined, setIsDefined] = useState(false);
  const checkboxRef = useRef<CxCheckbox | null>(null);

  useEffect(() => {
    Promise.all([
      customElements.whenDefined('cx-checkbox'),
    ]).then(() => {
      setIsDefined(true);
    });
  }, []);

  const handleCheckboxChange = useCallback((event: CxChangeEvent) => {
    onChange((event.target as CxCheckbox).checked);
  }, [onChange]);

  useEffect(() => {
    const checkbox = checkboxRef.current;
    if (checkbox && isDefined) {
      checkbox.addEventListener('cx-change', handleCheckboxChange);
    }

    return () => {
      if (checkbox && isDefined) {
        checkbox.removeEventListener('cx-change', handleCheckboxChange);
      }
    };
  }, [isDefined, handleCheckboxChange]);

  return (
    <cx-details open={open} data-value="metadata">
      <cx-space slot="summary" align-items='center'>
        <div className="details__summary__icon">
          <cx-icon name="short_text"></cx-icon>
        </div>
        <cx-typography variant="body3">Metadata</cx-typography>
      </cx-space>
      <cx-tooltip content="By default, almost all embedded metadata will be stripped. Apply this option to preserve embedded metadata." hoist>
        <cx-checkbox
          ref={checkboxRef}
          class="details__checkbox"
          checked={isDefined ? keepMetadata : false}
          disabled={!isDefined}
        >
          Preserve metadata
        </cx-checkbox>
      </cx-tooltip>
    </cx-details>
  );
};

export default Metadata;