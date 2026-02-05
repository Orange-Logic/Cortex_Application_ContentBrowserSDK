import type { CxSelect, CxChangeEvent } from '@orangelogic/design-system';
import { useState, useRef, useEffect, FC } from 'react';
import { Proxy } from '@/types/search';

type Props = {
  format: string;
  formats: Proxy[];
  open: boolean;
  onApply: (format: Proxy) => void;
};

const Extension: FC<Props> = ({ format, formats, open, onApply }) => {
  const [value, setValue] = useState(format);
  const [isDefined, setIsDefined] = useState(false);
  const extensionSelectRef = useRef<CxSelect>(null);

  useEffect(() => {
    Promise.all([customElements.whenDefined('cx-select')]).then(() => {
      setIsDefined(true);
    });
  }, []);

  useEffect(() => {
    const extensionSelect = extensionSelectRef.current;
    if (!extensionSelect || !isDefined) {
      return;
    }
    const onExtensionChange = (e: CxChangeEvent) => {
      const newFormatId = (e.target as HTMLOptionElement).value;
      setValue(newFormatId);
    };

    extensionSelect.addEventListener('cx-change', onExtensionChange);
    return () => {
      extensionSelect.removeEventListener('cx-change', onExtensionChange);
    };
  }, [formats, isDefined]);

  useEffect(( ) => {
    if (open) {
      setValue(format);
    }
  }, [format, open]);

  return (
    <cx-details open={open} data-value="format" className="format">
      <cx-space slot="summary" align-items="center">
        <div className="details__summary__icon">
          <cx-icon name="photo_size_select_large"></cx-icon>
        </div>
        <cx-typography variant="body3">Format</cx-typography>
      </cx-space>
      <cx-space direction="vertical" spacing="small" className="format">
        <cx-select
          value={isDefined ? value : ''}
          ref={extensionSelectRef}
          hoist
        >
          {formats.map((item) => (
            <cx-option key={item.id} value={item.id}>
              {item.proxyLabel}
            </cx-option>
          ))}
        </cx-select>
        <cx-button
          variant="primary"
          style={{
            marginLeft: 'auto',
          }}
          onClick={() => {
            const selectedProxy = formats.find((item) => item.id === value);
            if (selectedProxy) {
              onApply(selectedProxy);
            }
          }}
          disabled={value === format}
        >
          Apply
        </cx-button>
      </cx-space>
    </cx-details>
  );
};

export default Extension;
