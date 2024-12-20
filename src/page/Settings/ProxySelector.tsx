import { FormControl, FormHelperText, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { FC, useContext } from 'react';
import { GlobalConfigContext } from '../../GlobalConfigContext';
import { GetAvailableProxiesResponse } from '../../store/assets/assets.api';
import { StringTable } from '../../types/common';
import { HasElements } from '../../utils/array';

const SETTINGS_DEFAULT_PROXY = 'Always show asset format selector';

interface ProxySelectorProps extends Partial<GetAvailableProxiesResponse> {
  setProxyPreference: (docType: string, proxy: string) => void;
  proxyPreference: Partial<StringTable>
}

export const ProxySelector: FC<ProxySelectorProps> = ({ proxiesForDocType, setProxyPreference, proxyPreference }) => {
  const { pluginInfo } = useContext(GlobalConfigContext);

  if (!proxiesForDocType || !HasElements(proxiesForDocType)) {
    return <Typography>There is no valid proxy to select</Typography>;
  }

  return Object.keys(proxiesForDocType).map(docType => <FormControl key={docType}>
    <InputLabel>Default selection for {docType.toLocaleLowerCase()} when entering settings.</InputLabel>
    <Select
      label={'Default selection for {docType.toLocaleLowerCase()} when entering settings.'}
      defaultValue={proxyPreference && proxyPreference[docType]}
      onChange={(e) => setProxyPreference(docType, e.target.value as string)}>
      {Object.keys(proxiesForDocType[docType]).map(proxy =>
        <MenuItem key={proxy} value={proxy}>
          {proxiesForDocType[docType][proxy]}
        </MenuItem>)}
      <MenuItem
        value={''}
        sx={{ fontStyle: 'italic' }}>
        {SETTINGS_DEFAULT_PROXY}
      </MenuItem>
    </Select>
    <FormHelperText>
      This format option will be used when you add {docType.toLocaleLowerCase()}{pluginInfo.pluginShortName ? ` to ${pluginInfo.pluginShortName}` : ''}.
      This selection only applies to the current session.
    </FormHelperText>
  </FormControl>);
};

export default ProxySelector;