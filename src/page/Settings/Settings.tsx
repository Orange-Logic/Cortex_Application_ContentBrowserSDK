import { Button, Skeleton, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../../AppContext';
import { useAppDispatch, useAppSelector } from '../../store';
import { useGetAvailableProxiesQuery } from '../../store/assets/assets.api';
import { setStoredProxiesPreference, storedProxiesPreferenceSelector } from '../../store/assets/assets.slice';
import { openHome } from '../../store/navigation/navigation.slice';
import { StringTable } from '../../types/common';
import { CortexColors, LOGIN_GRAPHICS_TOP_COLOR_BASE64 } from '../../utils/constants';
import ProxySelector from './ProxySelector';

export const Settings = () => {
  const dispatch = useAppDispatch();
  const proxiesPreference = useAppSelector(storedProxiesPreferenceSelector);
  const [hasChanged, setHasChanged] = useState(false);
  const { onError } = useContext(AppContext);
  const { isSuccess, isError, error, isFetching, data } = useGetAvailableProxiesQuery({});

  const pendingProxiesPreference = useRef<StringTable>({});
  const setPendingProxyPreference = useCallback((docType: string, proxy: string) => {
    pendingProxiesPreference.current[docType] = proxy;
    setHasChanged(!Object.keys(pendingProxiesPreference.current)
      .every(type => (proxiesPreference[type] || !pendingProxiesPreference.current[type])
                  && (!proxiesPreference[type] || pendingProxiesPreference.current[type] === proxiesPreference[type])));
  }, []);

  useEffect(() => {
    if (isError || !isSuccess) {
      onError('Error fetching proxies', error as Error);
    }
  }, [isSuccess, isError, error]);

  const onSave = () => {
    if (hasChanged) dispatch(setStoredProxiesPreference(pendingProxiesPreference.current));
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
        {
          isFetching
            ? <Skeleton variant="rounded" width="100%" height={54} />
            : <ProxySelector proxiesForDocType={data?.proxiesForDocType} setProxyPreference={setPendingProxyPreference} proxyPreference={proxiesPreference}/>
        }
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
