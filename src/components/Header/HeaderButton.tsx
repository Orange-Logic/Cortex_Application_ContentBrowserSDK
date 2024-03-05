import { Button, ButtonProps } from '@mui/material';
import { FC } from 'react';
import { CortexFonts } from '../../utils/constants';

export const HeaderButton: FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <Button
      variant="text"
      color="primary"
      sx={{
        fontFamily: CortexFonts.Condensed,
        fontSize: 13,
        lineHeight: 1,
        letterSpacing: '0.015em',
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default HeaderButton;
