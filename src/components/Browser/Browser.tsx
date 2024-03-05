import {
  Alert,
  Box,
  Divider,
  List,
  ListItem,
  Skeleton,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useGetFoldersQuery } from '../../store/search/search.api';
import { RootFolder } from '../../store/search/search.slice';
import { Folder } from '../../types/search';
import { CortexColors } from '../../utils/constants';
import { useDebouncedEffect } from '../../utils/debounce';
import { NoResult } from '../NoResult';
import BrowserItem from './BrowserItem';
import BrowserSearchBox from './BrowserSearchBox';

type BrowserProps = {
  focusInput?: boolean;
  onFolderSelect?: (selectedFolder: Folder) => void;
};

const Browser = ({ focusInput, onFolderSelect }: BrowserProps) => {
  const [searchText, setSearchText] = useState('');
  const [internalText, setInternalText] = useState(searchText);
  useDebouncedEffect(() => setSearchText(internalText), [internalText], 1000);

  const searchInputRef = useRef<HTMLInputElement | undefined>();
  useEffect(() => {
    if (focusInput) {
      searchInputRef.current?.focus();
    }
  }, [focusInput]);

  const {
    data: folders,
    isLoading,
    isFetching,
    isError,
  } = useGetFoldersQuery({ folder: RootFolder, searchText });

  if (isLoading || isFetching)
    return (
      <Box>
        <BrowserSearchBox
          onFolderSelect={onFolderSelect}
          value={internalText}
          onValueChange={(val) => setInternalText(val)}
        />
        <List
          sx={{
            overflowY: 'auto',
          }}
        >
          <ListItem>
            <Skeleton variant="rounded" height={40} width="100%" />
          </ListItem>
          <ListItem>
            <Skeleton variant="rounded" height={40} width="100%" />
          </ListItem>
          <ListItem>
            <Skeleton variant="rounded" height={40} width="100%" />
          </ListItem>
          <ListItem>
            <Skeleton variant="rounded" height={40} width="100%" />
          </ListItem>
          <ListItem>
            <Skeleton variant="rounded" height={40} width="100%" />
          </ListItem>
          <ListItem>
            <Skeleton variant="rounded" height={40} width="100%" />
          </ListItem>
        </List>
      </Box>
    );

  if (isError)
    return (
      <Box>
        <BrowserSearchBox
          value={internalText}
          onValueChange={(val) => setInternalText(val)}
          onFolderSelect={onFolderSelect}
        />
        <Alert severity="error">Error</Alert>
      </Box>
    );

  return (
    <>
      <Box display="flex" flexDirection="column" maxHeight="400px" gap={0}>
        <BrowserSearchBox
          onFolderSelect={onFolderSelect}
          value={internalText}
          onValueChange={(val) => setInternalText(val)}
        />
        <Divider color={CortexColors.A100} />
        <List
          sx={{
            overflowY: 'auto',
          }}
        >
          {folders && folders.length > 0 ? (
            folders?.map((folder) => (
              <BrowserItem
                key={folder.id}
                folder={folder}
                onSelect={onFolderSelect}
                searchText={''}
              />
            ))
          ) : (
            <NoResult />
          )}
        </List>
      </Box>
    </>
  );
};

export default Browser;
