import ClearIcon from '@mui/icons-material/Clear';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import SearchIcon from '@mui/icons-material/Search';
import type { InputProps } from '@mui/material';
import {
  IconButton,
  Box,
  InputAdornment,
  Popover,
  TextField,
  Tooltip,
  InputLabel,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '../../store';
import { useGetFoldersQuery } from '../../store/search/search.api';
import {
  RootFolder,
  setImageSearchText,
} from '../../store/search/search.slice';
import { useDebouncedEffect } from '../../utils/debounce';
import { IsNullOrWhiteSpace } from '../../utils/string';
import { Browser as BrowserTree } from '../Browser';
import { CortexSwitch } from '../CortexSwitch';
import { CortexColors } from '../../utils/constants';

type SearchBarProps = {
  isSeeThrough: boolean;
  setIsSeeThrough: (isSeeThrough: boolean) => void;
  totalCount: number,
  currentCount: number,
};

const SearchBar = ({ isSeeThrough, setIsSeeThrough, totalCount, currentCount }: SearchBarProps)=> {
  const searchText = useAppSelector(
    (state: RootState) => state.search.imageSearchText,
  );
  const currentFolder = useAppSelector(
    (state: RootState) => state.search.currentFolder,
  );
  const dispatch = useAppDispatch();

  const [internalText, setInternalText] = useState(searchText);
  useDebouncedEffect(
    () => dispatch(setImageSearchText(internalText)),
    [internalText, dispatch],
    1000,
  );

  // Pre-fetch browser tree
  useGetFoldersQuery({ folder: RootFolder, searchText: '' });

  const onChange: InputProps['onChange'] = (e) =>
    setInternalText(e.target.value);

  const [anchorEl, setAnchorEl] = useState<Element>();

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const closeBrowser = () => setAnchorEl(undefined);

  const browserOpen = Boolean(anchorEl);

  return (
    <Box sx={{ display: 'flex', flexDirection:'column', gap: 1 }}>
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
        <TextField
          sx={{ flexGrow: 1 }}
          fullWidth
          value={internalText}
          onChange={onChange}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{
                  opacity: IsNullOrWhiteSpace(internalText) ? 0 : 1,
                }}
              >
                <IconButton disableRipple onClick={() => setInternalText('')}>
                  <ClearIcon></ClearIcon>
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent:'space-between', gap: 1 }}>
        <Tooltip title={isSeeThrough ? 'Turn off see-thru to only show direct children of the selected folder ' : 'Turn on see-thru to show all assets within the subfolder'} placement="right">
          <Box sx={{ display: 'flex', alignItems: 'center',  gap: 1 }}>
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
          paper:{
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
