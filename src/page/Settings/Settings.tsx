import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, Skeleton, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../AppContext';
import { useAppDispatch, useAppSelector } from '../../store';
import { useGetAvailableProxiesQuery } from '../../store/assets/assets.api';
import { ASSETS_FEATURE_STORAGE_KEY_IMPORT_PROXY, importProxySelector, setImportProxy } from '../../store/assets/assets.slice';
import { openHome } from '../../store/navigation/navigation.slice';
import { CortexColors, LOGIN_GRAPHICS_TOP_COLOR_BASE64 } from '../../utils/constants';
import { storeData } from '../../utils/storage';
import { GlobalConfigContext } from '../../GlobalConfigContext';

const SETTINGS_DEFAULT_PROXY = 'Always show asset format selector';

export const Settings = () => {
  const importProxy = useAppSelector(importProxySelector);
  const { pluginInfo } = useContext(GlobalConfigContext);
  const { isSuccess, isError, error, isFetching, data } = useGetAvailableProxiesQuery();
  const [currentProxy, setCurrentProxy] = useState<string>(importProxy || '');
  const [hasChanged, setHasChanged] = useState(false);
  const { onError } = useContext(AppContext);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isError || !isSuccess) {
      onError('Error fetching proxies', error as Error);
    }
  }, [isSuccess, isError, error]);

  const onSave = () => {
    dispatch(setImportProxy((currentProxy === SETTINGS_DEFAULT_PROXY || !currentProxy) ? '' : currentProxy));
    storeData(ASSETS_FEATURE_STORAGE_KEY_IMPORT_PROXY, currentProxy);
    dispatch(openHome());
  };

  return (
    <Box sx={{
      background: `url(${LOGIN_GRAPHICS_TOP_COLOR_BASE64})`,
      backgroundPositionX: 'center',
      backgroundPositionY: 'top',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      paddingTop: '15%',
      position: 'absolute',
      inset: 0,
      backgroundColor: CortexColors.A0,
      display: 'flex',
      justifyContent: 'center',
    }}>
      <Stack spacing={10} padding={2} mt={6} alignContent="start" component="form" noValidate onSubmit={onSave}>
        <Typography variant="h1" gutterBottom textAlign="center">
          Settings
        </Typography>
        <FormControl sx={{ m: 1 }}>
          <InputLabel>Default selection when entering settings.</InputLabel>
          {!isFetching ?
            <Select
              value={currentProxy}
              label="Default selection when entering setting."
              onChange={(e) => {
                setHasChanged(true);
                setCurrentProxy(e.target.value as string);
              }}
            >
              {data?.proxies &&
                Object.keys(data.proxies).map((key, id) => <MenuItem key={id} value={data?.proxies[key]}>{key}</MenuItem>)}
              <MenuItem value={SETTINGS_DEFAULT_PROXY} sx={{ fontStyle: 'italic' }}>{ SETTINGS_DEFAULT_PROXY }</MenuItem>
            </Select>
            : (
              <Skeleton variant="rounded" width="100%" height={54} />
            )
          }
          <FormHelperText>
            This format option will be used when you add assets{pluginInfo.pluginShortName ? ` to ${pluginInfo.pluginShortName}` : ''}.
            This selection only applies to the current session.
            {/* The proxy that you will be using when import the asset.
            The applied value only available for the current session. */}
          </FormHelperText>
        </FormControl>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
          <Button sx={{ mr: 2 }} color='secondary' onClick={() => dispatch(openHome())}>Close</Button>
          <Button disabled={!hasChanged} type="submit">Save</Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default Settings;
