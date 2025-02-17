import { useState } from 'react';

import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { useGetFoldersQuery } from '@/store/search/search.api';
import { explorePath } from '@/store/search/search.slice';
import { Folder } from '@/types/search';

import DumbBrowserItem from './DumbBrowserItem';

type BrowserItemProps = {
  folder: Folder;
  searchText: string;
  onSelect?: (selectedFolder: Folder) => void;
};

export const BrowserItem = ({
  folder,
  searchText,
  onSelect,
}: BrowserItemProps) => {
  const currentFolderID = useAppSelector(
    (state: RootState) => state.search.currentFolder.id,
  );
  const dispatch = useAppDispatch();

  const [isExpanded, setIsExpanded] = useState(false);

  const isSelected = currentFolderID === folder.id;

  const {
    data: folders,
    isLoading,
    isFetching,
    isUninitialized,
  } = useGetFoldersQuery({ folder, searchText }, { skip: !isExpanded });
  return (
    <DumbBrowserItem
      isExpanded={isExpanded}
      onExpandClick={(e) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
      }}
      onSelect={() => {
        dispatch(explorePath(folder));
        if (onSelect) {
          onSelect(folder);
        }
      }}
      isSelected={isSelected}
      folder={folder}
      isLoading={isLoading || isFetching}
      isUninitialized={isUninitialized}
    >
      {folders?.map((item) => (
        <BrowserItem
          key={item.id}
          folder={item}
          onSelect={onSelect}
          searchText={searchText}
        />
      ))}
    </DumbBrowserItem>
  );
};

export default BrowserItem;
