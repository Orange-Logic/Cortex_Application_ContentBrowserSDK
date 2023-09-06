import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import * as React from 'react';
import { AppliedFiltersMenuSection } from './Sections/AppliedFiltersMenuSection';
import { TypesMenuSection } from './Sections/TypesMenuSection';

export const FilterMenuPopover: React.FC = () => {
  return (
        <List
            sx={{ width: 360, bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="Assets Filters"
        >
            {/* Applied Filters  */}
            <AppliedFiltersMenuSection />

            <Divider />

            {/* Types */}
            <TypesMenuSection />
        </List>
  );
};

export default FilterMenuPopover;
