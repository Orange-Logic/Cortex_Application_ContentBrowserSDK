import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { IconButton, Popover } from '@mui/material';
import { useState } from 'react';
import { FilterMenuPopover } from './FilterMenuPopover';

export const FilterMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<Element>();

  const openPopover = (event: React.MouseEvent) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const closePopover = () => setAnchorEl(undefined);
  const browserOpen = Boolean(anchorEl);

  return (
        <>
            <IconButton onClick={openPopover}>
                <FilterAltIcon />
            </IconButton>
            <Popover
                open={browserOpen}
                anchorEl={anchorEl}
                onClose={closePopover}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
            >
                <FilterMenuPopover />
            </Popover>
        </>
  );
};

export default FilterMenu;
