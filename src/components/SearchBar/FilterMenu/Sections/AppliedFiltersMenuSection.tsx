import * as React from 'react';

import { useAppDispatch, useAppSelector } from '@/store';
import {
  getCurrentFolder, getMediaTypes, getSearchText, resetCurrentFolder, resetMediaTypes,
  resetSearchState, resetSearchText,
} from '@/store/search/search.slice';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';

import { FilterMenuSection } from './FilterMenuSection';

export const AppliedFiltersMenuSection: React.FC = () => {
  const searchText = useAppSelector(getSearchText);
  const currentFolder = useAppSelector(getCurrentFolder);
  const mediaTypes = useAppSelector(getMediaTypes);
  const dispatch = useAppDispatch();

  return (
    <FilterMenuSection sectionName="Applied Filters">
      <Box
        sx={{
          paddingX: 4,
          flexWrap: 'wrap',
          flexDirection: 'row',
          display: 'flex',
          gap: 1,
        }}
      >
        {searchText && (
          <Chip
            label={searchText}
            onDelete={() => dispatch(resetSearchText())}
          />
        )}
        {currentFolder?.title && (
          <Chip
            label={`In Folder ${currentFolder.title}`}
            onDelete={() => dispatch(resetCurrentFolder())}
          />
        )}
        {mediaTypes && !!mediaTypes.length && (
          <Chip
            label={`Types ${mediaTypes.join(', ')}`}
            onDelete={() => dispatch(resetMediaTypes())}
          />
        )}
      </Box>
      {(searchText ||
        (currentFolder?.title) ||
        (mediaTypes && !!mediaTypes.length)) && (
        <Button
          onClick={() => dispatch(resetSearchState())}
          sx={{ ml: 4, my: 1 }}
          variant="text"
          size="small"
        >
          <CloseIcon />
          CLEAR ALL
        </Button>
      )}
    </FilterMenuSection>
  );
};

export default AppliedFiltersMenuSection;
