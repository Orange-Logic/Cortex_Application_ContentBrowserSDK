import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useGetFoldersQuery } from '@/store/search/search.api';
import { Folder } from '@/types/search';

import type { CxCollapseEvent, CxTreeItem } from '@orangelogic-private/design-system';
import { FOLDER_PAGE_SIZE } from '@/utils/constants';
import LoadMoreButton from './LoadMoreButton';

const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getHighlightedTitle = (title: string, searchText?: string) => {
  if (!searchText) return title;

  const originalWords = searchText.toLowerCase().split(' ').filter(Boolean);
  const escapedWords = originalWords.map(escapeRegExp);
  const regex = new RegExp(`(${escapedWords.join('|')})`, 'gi');

  const parts = title.split(regex);

  return parts.map((part, index) =>
    originalWords.includes(part.toLowerCase()) ? <strong key={index}>{part}</strong> : part,
  );
};

type Props = {
  allowedFolders?: string[];
  folder: Folder;
  currentFolderID: string;
  icon?: string;
  searchText?: string;
  useSession?: string;
};

export const BrowserItem: FC<Props> = ({
  allowedFolders,
  folder,
  currentFolderID,
  icon,
  searchText,
  useSession,
}) => {
  const [isDefined, setIsDefined] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [pagination, setPagination] = useState({
    start: 0,
    pageSize: FOLDER_PAGE_SIZE,
  });
  const treeItemRef = useRef<CxTreeItem>(null);
  const isSelected = currentFolderID === folder.id;

  const {
    data: folderData,
    isFetching,
    isLoading,
  } = useGetFoldersQuery(
    { allowedFolders, folder, searchText: '', useSession, start: pagination.start, pageSize: pagination.pageSize },
    { skip: !isExpanded },
  );
  const folders = useMemo(() => {
    return folderData?.items ?? undefined;
  }, [folderData]);

  const totalCount = folderData?.totalCount ?? 0;

  const loadMore = useCallback(() => {
    const start = folders?.length || 0;
    if (start >= totalCount) return;
    setPagination((prev) => ({
      ...prev,
      start,
    }));
  }, [folders?.length, totalCount]);

  useEffect(() => {
    Promise.all([customElements.whenDefined('cx-tree-item')]).then(() => {
      setIsDefined(true);
    });
  }, [isDefined]);

  useEffect(() => {
    const treeItem = treeItemRef.current;
    if (!treeItem) return;
    const onExpand = () => {
      setIsExpanded(true);
    };
    const onCollapse = (e: CxCollapseEvent) => {
      if (e.detail.target === treeItemRef.current) {
        setIsExpanded(false);
      }
    };
    treeItem.addEventListener('cx-lazy-load', onExpand);
    treeItem.addEventListener('cx-expand', onExpand);
    treeItem.addEventListener('cx-collapse', onCollapse);

    return () => {
      treeItem.removeEventListener('cx-lazy-load', onExpand);
      treeItem.removeEventListener('cx-expand', onExpand);
      treeItem.removeEventListener('cx-collapse', onCollapse);
    };
  }, [isDefined]);

  const iconName = useMemo(() => {
    let resolvedIcon: string;
    if (icon) {
      resolvedIcon = icon!;
    } else if (folder.docType === 'Album') {
      resolvedIcon = 'share';
    } else {
      resolvedIcon = 'folder';
    }
    return resolvedIcon;
  }, [folder.docType, icon]);

  // Lazy load if folder has children
  // and (folders are not fetched yet or are fetching)
  const isLazy = folder.hasChildren && (folders === undefined || isFetching);

  return (
    <>
      <cx-tree-item
        ref={treeItemRef}
        data-value={JSON.stringify(folder)}
        expanded={isExpanded}
        selected={isSelected}
        lazy={isLazy}
      >
        <cx-icon name={iconName}></cx-icon>
        <cx-line-clamp lines={1}>{getHighlightedTitle(folder.title, searchText)}</cx-line-clamp>
        {folders?.map((item) => (
          <BrowserItem
            key={item.id}
            folder={item}
            searchText={searchText}
            currentFolderID={currentFolderID}
          />
        ))}
      </cx-tree-item>
      {folders && folders.length < totalCount && !isLoading && (
        <LoadMoreButton
          loadMore={loadMore}
          isLoading={isFetching}
          disabled={isFetching}
        />
      )}
    </>
  );
};

export default BrowserItem;
