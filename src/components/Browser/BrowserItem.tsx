import { FC, useEffect, useRef, useState } from 'react';

import { useGetFoldersQuery } from '@/store/search/search.api';
import { Folder } from '@/types/search';

import { CxCollapseEvent, CxTreeItem } from '@/web-component';

type Props = {
  folder: Folder;
  currentFolderID: string;
  searchText?: string;
};

export const BrowserItem: FC<Props> = ({
  folder,
  currentFolderID,
  searchText,
}) => {
  const [isDefined, setIsDefined] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lazyLoaded, setLazyLoaded] = useState(false);
  const treeItemRef = useRef<CxTreeItem>(null);
  const isSelected = currentFolderID === folder.id;

  const {
    data: folders,
    isLoading,
    isFetching,
    isUninitialized,
  } = useGetFoldersQuery({ folder, searchText: searchText ?? '' }, { skip: !isExpanded });

  const mayHaveChildren = !folder || isLoading || isFetching || isUninitialized;
  const hasChildren = folders && folders.length > 0 && !(isLoading || isUninitialized);
  const lazy = !lazyLoaded && !hasChildren && !mayHaveChildren;

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
      setLazyLoaded(true);
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
      expanded={isExpanded && !lazy}
      selected={isSelected}
      lazy={!lazyLoaded}
    >
      <cx-icon name="folder"></cx-icon>
      {folder.title}
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
