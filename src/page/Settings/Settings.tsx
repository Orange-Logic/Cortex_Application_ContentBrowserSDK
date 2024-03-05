import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, Skeleton, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../AppContext';
import { useAppDispatch, useAppSelector } from '../../store';
import { useGetAvailableProxiesQuery } from '../../store/assets/assets.api';
import { importProxySelector, setImportProxy } from '../../store/assets/assets.slice';
import { openHome } from '../../store/navigation/navigation.slice';
import { CortexColors, LOGIN_GRAPHICS_TOP_COLOR_BASE64 } from '../../utils/constants';

const SETTINGS_DEFAULT_PROXY = 'Always show asset proxy selector';

export const Settings = () => {
  const importProxy = useAppSelector(importProxySelector);
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
    dispatch(openHome());
  };

  return (<Box sx={{
    background: `url(${LOGIN_GRAPHICS_TOP_COLOR_BASE64})`,
    backgroundPositionX: 'center',
    backgroundPositionY: 'top',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    paddingTop: '15%',
    paddingX: '12%',
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: '85%',
    backgroundColor: CortexColors.A0,
  }}>
    <Typography variant="h1" gutterBottom textAlign="center">
      Configuration
    </Typography>
    <Stack spacing={4} padding={2} mt={6} alignContent="start" component="form" noValidate onSubmit={onSave}>
      <FormControl sx={{ m: 1 }}>
        <InputLabel>Default import proxy</InputLabel>
        {!isFetching ?
          <Select
            value={currentProxy}
            label="Default import proxy"
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
        <FormHelperText>The proxy that you will be using when import the asset.</FormHelperText>
      </FormControl>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}>
        <Button sx={{ mr: 2 }} color='secondary' onClick={() => dispatch(openHome())}>Exit</Button>
        <Button disabled={!hasChanged} type="submit">Save</Button>
      </Box>
    </Stack>
  </Box>);
};

export default Settings;
