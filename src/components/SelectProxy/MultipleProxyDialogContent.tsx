import React, { useLayoutEffect, useState } from 'react';

import { useAppSelector } from '@/store';
import {
  SETTINGS_DEFAULT_PROXY, storedProxiesPreferenceSelector,
} from '@/store/assets/assets.slice';
import { HasElements } from '@/utils/array';
import { IsStringFilled } from '@/utils/string';
import { FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';

interface Props {
  docType: string;
  proxyInfos: { [key: string]: string };
  onSetImportProxy: (docType: string, proxy: string) => void;
}

const MultipleProxySelectorDialogContent: React.FC<Props> = ({ docType, proxyInfos, onSetImportProxy }) => {
  const proxiesPreference = useAppSelector(storedProxiesPreferenceSelector);
  const [selectedProxy, setSelectedProxy] = useState<string | null>(null);

  useLayoutEffect(() => {
    const defaultProxy = proxiesPreference[docType] !== SETTINGS_DEFAULT_PROXY && IsStringFilled(proxiesPreference[docType])
      ? proxiesPreference[docType]
      : Object.keys(proxyInfos).length === 1
        ? Object.keys(proxyInfos)[0]
        : null;

    if (IsStringFilled(defaultProxy)) {
      setSelectedProxy(defaultProxy as string);
      onSetImportProxy(docType, defaultProxy as string);
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newProxy = event.target.value;
    setSelectedProxy(newProxy);
    onSetImportProxy(docType, newProxy);
  };

  return (
    <>
      <Typography paddingTop={1}>{docType} quality</Typography>
      <RadioGroup
        aria-labelledby="format-label"
        name="format"
        onChange={handleChange}
        value={selectedProxy}
      >
        {HasElements(proxyInfos)
          ? Object.keys(proxyInfos).map((key, index) => (
          <FormControlLabel
            key={index}
            value={key}
            control={<Radio sx={{ width: '40px', height: '40px' }} />}
            label={proxyInfos[key]}
          />
          ))
          : <Typography>No {docType} proxy available. You will not be able to import asset of this type.</Typography>
        }
      </RadioGroup>
    </>
  );
};

export default MultipleProxySelectorDialogContent;