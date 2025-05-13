import { FC, useEffect, useRef, useState } from 'react';

import { useGetFoldersQuery } from '@/store/search/search.api';
import { Folder } from '@/types/search';

import { CxCollapseEvent, CxTreeItem } from '@/web-component';

export const getHighlightedTitle = (title: string, searchText?: string) => {
  if (!searchText) return title;
  const searchWords = searchText.toLowerCase().split(' ').filter(Boolean);
  const regex = new RegExp(`(${searchWords.join('|')})`, 'gi');
  const parts = title.split(regex);

  return parts.map((part, index) =>
    searchWords.includes(part.toLowerCase()) ? <strong key={index}>{part}</strong> : part,
  );
};

type Props = {
  folder: Folder;
  currentFolderID: string;
  searchText?: string;
  useSession?: string;
};

export const BrowserItem: FC<Props> = ({
  folder,
  currentFolderID,
  searchText,
  useSession,
}) => {
  const [isDefined, setIsDefined] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const treeItemRef = useRef<CxTreeItem>(null);
  const isSelected = currentFolderID === folder.id;

  const {
    data: folders,
    isFetching,
  } = useGetFoldersQuery({ folder, searchText: '', useSession }, { skip: !isExpanded });

  useEffect(() => {
    Promise.all([
      customElements.whenDefined('cx-tree-item'),
    ]).then(() => {
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

  // Lazy load if folder has children
  // and (folders are not fetched yet or are fetching)
  const isLazy = folder.hasChildren && (folders === undefined || isFetching);

  return (
    <cx-tree-item
      ref={treeItemRef}
      data-value={JSON.stringify(folder)}
      expanded={isExpanded}
      selected={isSelected}
      lazy={isLazy}
    >
      <cx-icon name="folder"></cx-icon>
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
  );
};

export default BrowserItem;
