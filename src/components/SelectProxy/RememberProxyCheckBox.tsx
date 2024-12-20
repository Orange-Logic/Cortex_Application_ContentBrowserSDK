import { Checkbox, FormControlLabel, FormHelperText } from '@mui/material';
import { FC, useState } from 'react';

interface RememberProxyCheckBoxProps {
  setRemeber: (value: boolean) => void;
}

// eslint-disable-next-line react/display-name
export const RememberProxyCheckBox: FC<RememberProxyCheckBoxProps> = ({ setRemeber }) => {
  const [rememberProxy, setRememberProxy] = useState<boolean>(false);

  return <>
    <FormControlLabel
      sx={{
        display: 'flex',
      }}
      control={
        (
          <Checkbox
            sx={{
              width: '40px', height: '40px',
            }}
            onChange={(e) => {
              setRememberProxy(e.target.checked);
              setRemeber(e.target.checked);
            }}
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
  </>;
};

export default RememberProxyCheckBox;