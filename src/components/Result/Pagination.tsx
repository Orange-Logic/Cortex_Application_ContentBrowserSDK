import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import { KeyboardEventHandler, useEffect, useState } from 'react';
import { CortexColors } from '../../utils/constants';
type PaginationProps = {
  start: number;
  limit: number;
  itemCount: number;
  onPrevious: () => void;
  onNext: () => void;
  onGoTo: (pageNumber: number) => void;
};

const Pagination = ({
  start,
  limit,
  itemCount,
  onNext,
  onPrevious,
  onGoTo,
}: PaginationProps) => {
  const pageCount = Math.ceil(itemCount / limit);
  const pageNumber = Math.min(start / limit + 1, pageCount);
  const nextPageStart = start + limit;
  const previousPageStart = start - limit;
  const firstPage = previousPageStart < 0;
  const lastPage = nextPageStart > itemCount;

  const [internalNumber, setInternalNumber] = useState(pageNumber.toString());
  useEffect(() => setInternalNumber(pageNumber.toString()), [pageNumber]);
  const [inputWidth, setInputWidth] = useState(36);
  useEffect(() => {
    setInputWidth(internalNumber.length * 12 + 8);
  }, [internalNumber]);

  const updatePage = () => {
    const page = parseInt(internalNumber);
    if (page && page >= 1 && page <= pageCount) onGoTo(page);
    else if (!page || page < 1) {
      onGoTo(Math.min(1, pageCount));
      setInternalNumber(Math.min(1, pageCount).toString());
    } else {
      onGoTo(pageCount);
      setInternalNumber(pageCount.toString());
    }
  };

  // Link: https://link.orangelogic.com/Tasks/4JYSE
  // Enter to go to new page
  const onKeyDown: KeyboardEventHandler = (e) => {
    if (e.key === 'Enter') updatePage();
  };

  return (
    <Box display="flex" alignItems="center">
      <IconButton
        disableRipple
        disabled={firstPage}
        size="small"
        onClick={onPrevious}
        sx={{
          color: CortexColors.A600,
          '&:hover': { color: 'primary.main' },
        }}
      >
        <ArrowBackIcon sx={{ width: 16, height: 16 }} />
      </IconButton>
      <TextField
        value={internalNumber}
        size="small"
        onChange={(e) => setInternalNumber(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={updatePage}
        sx={{
          minWidth: 24,
          width: inputWidth,
          '& input': { padding: 1, textAlign: 'center' },
          '& .MuiOutlinedInput-notchedOutline': { opacity: 0 },
          '&:hover .MuiOutlinedInput-notchedOutline': { opacity: 1 },
          '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            opacity: 1,
          },
          color: CortexColors.A700,
        }}
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
      />
      <Typography sx={{ pl: 2, color: CortexColors.A600 }}>
        {' '}
        of {pageCount}
      </Typography>
      <IconButton
        disableRipple
        disabled={lastPage}
        onClick={onNext}
        sx={(theme) => ({
          color: CortexColors.A600,
          '&:hover': { color: theme.palette.primary.main },
        })}
      >
        <ArrowForwardIcon sx={{ width: 16, height: 16 }} />
      </IconButton>
    </Box>
  );
};

export default Pagination;
