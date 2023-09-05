import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';

interface FilterMenuSectionProps {
  sectionName: string;
  children: React.ReactNode;
}

export const FilterMenuSection: React.FC<FilterMenuSectionProps> = ({
  sectionName,
  children,
}) => {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
        <>
            <ListItemButton onClick={handleClick}>
                <ListItemText
                    primary={sectionName}
                    sx={(theme) => ({ fontWeight: theme.typography.fontWeightBold })}
                    disableTypography
                />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {children}
            </Collapse>
        </>
  );
};

export default FilterMenuSection;
