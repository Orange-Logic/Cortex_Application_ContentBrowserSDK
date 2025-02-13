import React, { useState } from 'react';
import { Checkbox, FormControlLabel, FormHelperText } from '@mui/material';

interface RememberProxyCheckBoxProps {
  setRemember: (value: boolean) => void;
}

const RememberProxyCheckBox: React.FC<RememberProxyCheckBoxProps> = ({ setRemember }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    setRemember(event.target.checked);
  };

  return (
    <>
      <FormControlLabel
        sx={{ display: 'flex' }}
        control={
          <Checkbox
            sx={{ width: '40px', height: '40px' }}
            onChange={handleChange}
            checked={isChecked}
            name="rememberMe"
          />
        }
        label="Remember this option"
      />
      {isChecked && (
        <FormHelperText component="span">
          Remember this option for the next time you import assets. You can change this inside the settings menu.
        </FormHelperText>
      )}
    </>
  );
};

export default RememberProxyCheckBox;
