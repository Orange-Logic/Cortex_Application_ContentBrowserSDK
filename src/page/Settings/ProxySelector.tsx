import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { useContext, useState } from 'react';
import { GlobalConfigContext } from '../../GlobalConfigContext';
import { SETTINGS_DEFAULT_PROXY } from '../../store/assets/assets.slice';
import { StringTable } from '../../types/common';

interface ProxySelectorProps {
  proxiesForDocType?: { [docType: string]: StringTable };
  setProxyPreference: (docType: string, proxy: string) => void;
  proxyPreference: Partial<StringTable>;
}

const ProxySelector: React.FC<ProxySelectorProps> = ({ proxiesForDocType, setProxyPreference, proxyPreference }) => {
  const [localProxyPreference, setLocalProxyPreference] = useState<Partial<StringTable>>(proxyPreference);
  const { pluginInfo } = useContext(GlobalConfigContext);

  const handleChange = (docType: string) => (event: SelectChangeEvent) => {
    const newProxy = event.target.value;
    setLocalProxyPreference((prev) => ({ ...prev, [docType]: newProxy }));
    setProxyPreference(docType, newProxy);
  };

  return (<>
    {proxiesForDocType && Object.keys(proxiesForDocType).map((docType) => {
      const label = `Default ${docType} proxy selection when entering setting.`;

      return (
        <FormControl key={docType} sx={{ m: 1 }}>
          <InputLabel id={`${docType}-proxy-selector-label`}>{label}</InputLabel>
          <Select
            labelId={`${docType}-proxy-selector-label`}
            id={`${docType}-proxy-selector`}
            value={localProxyPreference[docType] || SETTINGS_DEFAULT_PROXY}
            label={label}
            onChange={handleChange(docType)}
          >
            {Object.entries(proxiesForDocType[docType]).map(([proxy, proxyName]) => <MenuItem key={proxy} value={proxy}>{proxyName}</MenuItem>)}
            <MenuItem value={SETTINGS_DEFAULT_PROXY} sx={{ fontStyle: 'italic' }}>{SETTINGS_DEFAULT_PROXY}</MenuItem>
          </Select>
          <FormHelperText>
            This format option will be used when you add assets{pluginInfo.pluginShortName ? ` to ${pluginInfo.pluginShortName}` : ''}.
            This selection only applies to the current session.
            {/* The proxy that you will be using when import the asset.
              The applied value only available for the current session. */}
          </FormHelperText>
        </FormControl>
      );
    })}
  </>);
};

export default ProxySelector;