import { FC, useEffect, useMemo, useRef, useState } from 'react';

import { useGetFoldersQuery } from '@/store/search/search.api';
import { Folder } from '@/types/search';

import { CxCollapseEvent, CxTreeItem } from '@/web-component';

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
  } = useGetFoldersQuery({ folder, searchText: searchText ?? '', useSession }, { skip: !isExpanded });

  const highlightedTitle = useMemo(() => {
    if (!searchText) return folder.title;
    const searchWords = searchText.toLowerCase().split(' ').filter(Boolean);
    const regex = new RegExp(`(${searchWords.join('|')})`, 'gi');
    const parts = folder.title.split(regex);

    return parts.map((part, index) =>
      searchWords.includes(part.toLowerCase()) ? <strong key={index}>{part}</strong> : part,
    );
  }, [folder.title, searchText]);

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

  return (
    <cx-tree-item
      ref={treeItemRef}
      data-value={JSON.stringify(folder)}
      expanded={isExpanded}
      selected={isSelected}
      lazy={folder.hasChildren}
    >
      <cx-icon name="folder"></cx-icon>
      <cx-line-clamp lines={1}>{highlightedTitle}</cx-line-clamp>
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
