import ClearIcon from '@mui/icons-material/Clear';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from '@mui/material';
import { useAppDispatch } from '../../store';
import { RootFolder, explorePath } from '../../store/search/search.slice';
import { Folder } from '../../types/search';
import { CortexColors } from '../../utils/constants';
import { IsNullOrWhiteSpace } from '../../utils/string';


type BrowserSearchBoxProps = {
  value: string;
  onValueChange: (val: string) => void;
  onFolderSelect?: (selectedFolder: Folder) => void;
};

export const BrowserSearchBox = ({
  value,
  onValueChange,
  onFolderSelect,
}: BrowserSearchBoxProps) => {
  const dispatch = useAppDispatch();

  return (
    <Box
      sx={{
        display: 'flex',
        padding: 2,
      }}
    >
      <Tooltip title={'Home Folder'} placement="top-start" arrow>
        <IconButton
          disableRipple
          onClick={() => {
            onValueChange('');
            dispatch(explorePath(RootFolder));
            if (onFolderSelect) {
              onFolderSelect(RootFolder);
            } 
          }}
          sx={{ marginRight: 1 }}
        >
          <HomeIcon sx={{ color: CortexColors.A600 }} />
        </IconButton>
      </Tooltip>
      <TextField
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder="Search for folders"
        fullWidth
        inputRef={(node: HTMLInputElement) => node?.focus()}
        sx={{
          '& .Mui-focused > svg': {
            color: CortexColors.B500,
          },
          position: 'sticky',
          top: 0,
          zIndex: 1,
        }}
        InputProps={{
          sx: {
            paddingLeft: 2,
            paddingRight: 0,
          },
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: CortexColors.A700 }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment
              position="end"
              sx={{
                opacity: IsNullOrWhiteSpace(value) ? 0 : 1,
              }}
            >
              <IconButton disableRipple onClick={() => onValueChange('')}>
                <ClearIcon></ClearIcon>
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default BrowserSearchBox;