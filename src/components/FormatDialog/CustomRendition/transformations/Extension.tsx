import { CxSelect, CxChangeEvent } from '@/web-component';
import { useState, useRef, useEffect, FC } from 'react';

type Props = { 
  extension: string, 
  extensions: { displayName: string; value: string }[],
  onChange: (extension: string) => void;
};

const Extension: FC<Props> = ({ 
  extension,
  extensions,
  onChange,
}) => {
  const [isDefined, setIsDefined] = useState(false);
  const extensionSelectRef = useRef<CxSelect>(null);

  useEffect(() => {
    Promise.all([
      customElements.whenDefined('cx-select'),
    ]).then(() => {
      setIsDefined(true);
    });
  }, []);

  useEffect(() => {
    const extensionSelect = extensionSelectRef.current;
    if (!extensionSelect || !isDefined) {
      return;
    }
    const onExtensionChange = (e: CxChangeEvent) => {
      const newExtension = (e.target as HTMLOptionElement).value;
      onChange(newExtension);
    };

    extensionSelect.addEventListener('cx-change', onExtensionChange);
    return () => {
      extensionSelect.removeEventListener('cx-change', onExtensionChange);
    };
  }, [isDefined, onChange]);

  return (
    <cx-space direction="vertical" spacing="small" className="extension">
      <cx-typography variant="body2">Extension</cx-typography>
      <cx-select value={isDefined ? extension : ''} ref={extensionSelectRef} hoist>
        {extensions.map((item) => (
          <cx-option key={item.value} value={item.value}>{item.displayName}</cx-option>
        ))}
      </cx-select>
    </cx-space>
  );
};

export default Extension;