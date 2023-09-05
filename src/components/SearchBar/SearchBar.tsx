import { useState } from 'react';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Box from '@mui/system/Box';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { InputLabel, Typography } from '@mui/material';

import { RootState, useAppDispatch, useAppSelector } from '../../store';
import { useGetFoldersQuery } from '../../store/search/search.api';
import {
  RootFolder,
  setImageSearchText,
} from '../../store/search/search.slice';
import { FilterMenu } from './FilterMenu/FilterMenu';
import { SearchInput } from './SearchInput';
import { Browser as BrowserTree } from '../Browser';
import { CortexSwitch } from '../CortexSwitch';
import { CortexColors } from '../../utils/constants';

type SearchBarProps = {
  isSeeThrough: boolean;
  setIsSeeThrough: (isSeeThrough: boolean) => void;
  totalCount: number,
  currentCount: number,
};

const SearchBar = ({ isSeeThrough, setIsSeeThrough, totalCount, currentCount }: SearchBarProps) => {
  const searchText = useAppSelector(
    (state: RootState) => state.search.imageSearchText,
  );
  const currentFolder = useAppSelector(
    (state: RootState) => state.search.currentFolder,
  );
  const dispatch = useAppDispatch();

  // Pre-fetch browser tree
  useGetFoldersQuery({ folder: RootFolder, searchText: '' });

  const [anchorEl, setAnchorEl] = useState<Element>();

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const closeBrowser = () => setAnchorEl(undefined);

  const browserOpen = Boolean(anchorEl);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title={currentFolder.title} placement="top-start">
          <TextField
            fullWidth
            value={currentFolder.title}
            size="small"
            sx={{
              cursor: 'pointer',
              maxWidth: 250,
            }}
            label="Folder"
            onMouseDownCapture={handleClick}
            inputProps={{
              sx: {
                cursor: 'pointer',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: '1',
                WebkitBoxOrient: 'vertical',
              },
            }}
            InputLabelProps={{
              sx: {
                cursor: 'pointer',
              },
            }}
            InputProps={{
              sx: {
                cursor: 'pointer',
              },
              endAdornment: (
                <InputAdornment position="end">
                  {browserOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                </InputAdornment>
              ),
            }}
          />
        </Tooltip>
        <SearchInput
          defaultValue={searchText}
          onValueChange={(value) => dispatch(setImageSearchText(value))}
        />
        <FilterMenu />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Tooltip title={isSeeThrough ? 'Turn off see-thru to only show direct children of the selected folder ' : 'Turn on see-thru to show all assets within the subfolder'} placement="right">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InputLabel>See-thru</InputLabel>
            <CortexSwitch
              checked={isSeeThrough}
              onChange={(e) => setIsSeeThrough(e.target.checked)}
            />
          </Box>
        </Tooltip>
        {(totalCount > 0 && currentCount > 0) &&
          (<Typography sx={{ color: CortexColors.A500 }} fontWeight='500' fontStyle='italic'>
            Showing {currentCount} of {totalCount} result{totalCount > 1 && 's'}
          </Typography>)
        }
      </Box>
      <Popover
        open={browserOpen}
        anchorEl={anchorEl}
        onClose={closeBrowser}
        keepMounted
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 240,
              maxWidth: 500,
            },
          },
        }}
      >
        <BrowserTree />
      </Popover>
    </Box>
  );
};

export default SearchBar;
