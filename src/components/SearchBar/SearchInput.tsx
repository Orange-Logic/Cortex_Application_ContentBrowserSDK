import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useDebouncedEffect } from '../../utils/debounce';
import { IsNullOrWhiteSpace } from '../../utils/string';

interface SearchInputProps {
  defaultValue: string;
  onValueChange: (value: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  defaultValue,
  onValueChange,
}) => {
  const [internalText, setInternalText] = useState(defaultValue);
  useDebouncedEffect(() => onValueChange(internalText), [internalText], 1000);
  useEffect(() => {
    setInternalText(defaultValue);
  }, [defaultValue]);

  return (
        <TextField
            sx={{ flexGrow: 1 }}
            fullWidth
            value={internalText}
            onChange={(e) => setInternalText(e.target.value)}
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
  );
};

export default SearchInput;
