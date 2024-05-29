import ImageIcon from '@mui/icons-material/Image';
import { Checkbox, DialogContent, Divider, FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { FC } from 'react';
import { useAppSelector } from '../../store';
import { totalSelectedAssetSelector } from '../../store/assets/assets.slice';

interface Props {
  proxies: { [key: string]: string },
  rememberProxy: boolean,
  onSetImportProxy: (proxy: string) => void,
  onSetRememberImportProxy: (remember: boolean) => void,
}

export const MultipleProxyDialogContent: FC<Props> = ({ proxies, onSetImportProxy, rememberProxy, onSetRememberImportProxy }) => {
  const totalSelectedAsset = useAppSelector(totalSelectedAssetSelector);

  return (
    <DialogContent sx={{ maxHeight: 400, userSelect: 'none' }}>
      <Box padding={2} bgcolor="#fff">
        <FormControl fullWidth>
          <FormLabel id="format-label" sx={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 2,
            gap: 2,
          }}>
            <ImageIcon color='inherit' fontSize='small' />{totalSelectedAsset} Selected Asset{totalSelectedAsset > 1 ? 's' : ''}
          </FormLabel>
          <Divider />
          <Typography paddingTop={1}>Quality</Typography>
          <RadioGroup
            aria-labelledby="format-label"
            name="format"
            onChange={e => onSetImportProxy(e.target.value)}
          >
            {
              Object.keys(proxies).map((key, index) =>
                <FormControlLabel
                  key={index}
                  value={proxies[key]}
                  control={
                    <Radio sx={{
                      width: '40px',
                      height: '40px',
                    }} />
                  }
                  label={key}
                />)
            }
          </RadioGroup>
          <Divider />
          <FormControlLabel
            sx={{
              display: 'flex',
            }}
            control={
              (
                <Checkbox
                  sx={{
                    width:'40px', height:'40px',
                  }}
                  onChange={(e) => onSetRememberImportProxy(e.target.checked)}
                  name="rememberMe"
                />
              )
            }
            label="Remember this option"
          />
          {rememberProxy &&
            <FormHelperText component='span'>
              Remember this option for the next time you import assets. You can change this inside the settings menu
            </FormHelperText>
          }
        </FormControl>
      </Box>
    </DialogContent>
  );
};

export default MultipleProxyDialogContent;
