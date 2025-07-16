import _debounce from 'lodash-es/debounce';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { LIBRARY_NAME } from '@/consts/data';
import { useGetCollectionsQuery, useGetFoldersQuery } from '@/store/search/search.api';
import { RootFolder } from '@/store/search/search.slice';
import { Folder } from '@/types/search';
import { getData } from '@/utils/storage';
import type {
  CxChangeEvent,
  CxDrawer,
  CxInput,
  CxMenu,
  CxSelectEvent,
  CxSelectionChangeEvent,
  CxTree,
} from '@orangelogic-private/design-system';
import { skipToken } from '@reduxjs/toolkit/query';

import { Drawer } from './Browser.styled';
import BrowserItem, { getHighlightedTitle } from './BrowserItem';
import { FOLDER_PAGE_SIZE } from '@/utils/constants';
import LoadMoreButton from './LoadMoreButton';

type Props = {
  allowedFolders?: string[];
  collectionPath?: string;
  currentFolder: Folder;
  favoriteFolderId?: string;
  focusInput?: boolean;
  lastLocationMode?: boolean;
  open: boolean;
  showCollections?: boolean;
  showFavoriteFolder?: boolean;
  useSession?: string;
  onFolderSelect: (selectedFolder: Folder) => void;
  onClose: () => void;
};

const Browser: FC<Props> = ({
  allowedFolders,
  collectionPath,
  currentFolder,
  favoriteFolderId,
  focusInput,
  lastLocationMode,
  open,
  showCollections,
  showFavoriteFolder,
  useSession,
  onFolderSelect,
  onClose,
}) => {
  const [searchText, setSearchText] = useState('');
  const [isDefined, setIsDefined] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [isMoreCollectionsLoading, setIsMoreCollectionsLoading] = useState(false);

  const [pagination, setPagination] = useState({
    start: 0,
    pageSize: FOLDER_PAGE_SIZE,
  });

  const [collectionPagination, setCollectionPagination] = useState({
    start: 0,
    pageSize: FOLDER_PAGE_SIZE,
  });

  const collectionRef = useRef<CxMenu>(null);
  const drawerRef = useRef<CxDrawer>(null);
  const searchRef = useRef<CxInput>(null);
  const treeRef = useRef<CxTree>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    Promise.all([
      customElements.whenDefined('cx-drawer'),
      customElements.whenDefined('cx-input'),
      customElements.whenDefined('cx-tree'),
    ]).then(() => {
      setIsDefined(true);
    });
  }, []);

  useEffect(() => {
    const searchInput = searchRef.current;
    if (!searchInput) return;
    const onSearchInput = _debounce((e: CxChangeEvent) => {
      const value = (e.target as CxInput).value;
      if (searchText !== value && (value.length > 2 || value.length === 0)) {
        setSearchText(value);
      }
    }, 500);
    searchInput.addEventListener('cx-input', onSearchInput);

    return () => {
      searchInput.removeEventListener('cx-input', onSearchInput);
    };
  }, [isDefined, searchText]);

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;
    const onDrawerClose = () => {
      onClose();
    };
    drawer.addEventListener('cx-request-close', onDrawerClose);

    return () => {
      drawer.removeEventListener('cx-request-close', onDrawerClose);
    };
  }, [isDefined, onClose]);

  const {
    data: folderData,
    isLoading: isLoadingFolders,
    isFetching: isFetchingFolders,
    isError: isErrorFolders,
  } = useGetFoldersQuery({
    allowedFolders,
    folder: RootFolder,
    searchText,
    useSession,
    start: pagination.start,
    pageSize: pagination.pageSize,
  });

  const folders = useMemo(() => {
    return folderData?.items ?? undefined;
  }, [folderData]);

  const totalCount = folderData?.totalCount ?? 0;

  const loadMore = useCallback(() => {
    if (!folders) return;
    const start = folders.length;
    if (start >= totalCount) return;
    setIsMoreLoading(true);
    setPagination((prev) => ({
      ...prev,
      start,
    }));
  }, [folders, totalCount]);

  useEffect(() => {
    const handleDefaultFolder = () => {
      if (!folders) return;
      if (allowedFolders && allowedFolders.length > 0) {
        const allowedFolder = folders.find((item) =>
          allowedFolders.includes(item.id),
        );

        if (allowedFolder) {
          onFolderSelect(allowedFolder);
          return;
        }
      }
      const libraryFolder = folders.find((folder) => folder.title === LIBRARY_NAME);

      if (libraryFolder) {
        onFolderSelect(libraryFolder);
      } else {
        onFolderSelect(RootFolder);
      }
    };

    if (firstRender.current && folders) {
      firstRender.current = false;
      if (lastLocationMode) {
        getData('lastLocation').then((lastLocation) => {
          if (typeof lastLocation === 'string') {
            try {
              const folder = JSON.parse(lastLocation) as Folder;
              
              if ((folder.id === favoriteFolderId && !showFavoriteFolder) || (allowedFolders && allowedFolders.length > 0)) {
                handleDefaultFolder();
                return;
              }

              onFolderSelect(folder);
            } catch (error) {
              handleDefaultFolder();
            }
          } else {
            handleDefaultFolder();
          }
        }).catch(() => {
          handleDefaultFolder();
        });
      } else {
        handleDefaultFolder();
      }
    }
  }, [allowedFolders, favoriteFolderId, folders, lastLocationMode, onFolderSelect, showFavoriteFolder]);

  const {
    data: collectionData,
    isLoading: isLoadingCollections,
    isFetching: isFetchingCollections,
    isError: isErrorCollections,
  } = useGetCollectionsQuery(
    collectionPath
      ? {
        folder: collectionPath,
        searchText,
        useSession,
        start: collectionPagination.start,
        pageSize: collectionPagination.pageSize,
      }
      : skipToken,
  );

  const collections = useMemo(() => {
    return collectionData?.items ?? undefined;
  }, [collectionData]);

  const totalCollectionCount = collectionData?.totalCount ?? 0;

  const loadMoreCollections = useCallback(() => {
    if (!collections) return;
    setIsMoreCollectionsLoading(true);
    const start = collections.length;
    if (start >= totalCollectionCount) return;
    setCollectionPagination((prev) => ({
      ...prev,
      start,
    }));
  }, [collections, totalCollectionCount]);

  useEffect(() => {
    const tree = treeRef.current;
    if (!tree) return;
    const onTreeSelect = (e: CxSelectionChangeEvent) => {
      const folder = JSON.parse(
        e.detail.selection[0].dataset.value ?? '{}',
      ) as Folder;
      onFolderSelect?.(folder);
    };
    tree.addEventListener('cx-selection-change', onTreeSelect);
  }, [isDefined, onFolderSelect]);

  useEffect(() => {
    const collection = collectionRef.current;
    if (!collection) return;
    const onCollectionSelect = (e: CxSelectEvent) => {
      const folder = JSON.parse(e.detail.item.value ?? '{}') as Folder;
      onFolderSelect?.(folder);
    };
    collection.addEventListener('cx-select', onCollectionSelect);

    return () => {
      collection.removeEventListener('cx-select', onCollectionSelect);
    };
  }, [isDefined, collections, onFolderSelect]);

  useEffect(() => {
    if (!isFetchingFolders) {
      setIsMoreLoading(false);
    }
  }, [isFetchingFolders]);

  useEffect(() => {
    if (!isFetchingCollections) {
      setIsMoreCollectionsLoading(false);
    }
  }, [isFetchingCollections]);

  const renderFolders = useCallback(() => {
    if (isLoadingFolders || (isFetchingFolders && !isMoreLoading)) {
      return Array.from({ length: 5 }).map((_, index) => (
        <cx-skeleton key={index}></cx-skeleton>
      ));
    } else if (folders && folders.length > 0) {
      const result = [];

      if (favoriteFolderId) {
        result.push(
          <BrowserItem
            key={favoriteFolderId}
            folder={{
              id: favoriteFolderId,
              title: 'My Favorites',
              docType: 'Story',
              path: [],
              parents: [],
              fullPath: 'My Favorites',
              hasChildren: false,
            }}
            currentFolderID={currentFolder.id}
            icon="star"
            useSession={useSession}
          />,
        );
      }

      return [
        ...result,
        ...(folders ?? []).map((folder) => (
          <BrowserItem
            key={folder.id}
            allowedFolders={allowedFolders}
            folder={folder}
            currentFolderID={currentFolder.id}
            searchText={searchText}
            useSession={useSession}
          />
        )),
      ];
    } else if (isErrorFolders) {
      return (
        <cx-typography variant="body3">Failed to load folders</cx-typography>
      );
    }

    return <cx-typography variant="body3">No folders found</cx-typography>;
  }, [
    allowedFolders,
    currentFolder.id,
    favoriteFolderId,
    folders,
    isErrorFolders,
    isFetchingFolders,
    isLoadingFolders,
    searchText,
    useSession,
    isMoreLoading,
  ]);

  const renderCollections = useCallback(() => {
    if (isLoadingCollections || (isFetchingCollections && !isMoreCollectionsLoading)) {
      return Array.from({ length: 5 }).map((_, index) => (
        <cx-skeleton key={index}></cx-skeleton>
      ));
    } else if (collections && collections.length > 0) {
      return collections?.map((collection) => {
        const isSelected = currentFolder.id === collection.id;

        return (  
          <cx-menu-item
            key={collection.id}
            value={JSON.stringify(collection)}
            className={`${isSelected ? 'selected' : ''}`}
          >
            <cx-icon slot="prefix" name="collections"></cx-icon>
            {getHighlightedTitle(collection.title, searchText)}
          </cx-menu-item>
        );
      });
    } else if (isErrorCollections) {
      return (
        <cx-typography variant="body3">
          Failed to load collections
        </cx-typography>
      );
    }

    return <cx-typography variant="body3">No collections found</cx-typography>;
  }, [
    isLoadingCollections,
    isFetchingCollections,
    collections,
    isErrorCollections,
    currentFolder.id,
    searchText,
    isMoreCollectionsLoading,
  ]);

  return (
    <Drawer
      ref={drawerRef}
      label="Browser"
      placement="start"
      contained
      open={open}
    >
      <cx-space direction="vertical" spacing="small" wrap="nowrap">
        <cx-space
          direction="vertical"
          spacing="small"
          style={{
            padding: 'var(--body-spacing) var(--body-spacing) 0',
          }}
        >
          <cx-typography variant="body3">Folders</cx-typography>
          <cx-input
            ref={searchRef}
            value={searchText}
            placeholder="Search..."
            clearable
            autoFocus={focusInput}
            className='search-input'
          >
            <cx-icon name="search" slot="prefix" className="icon--large"></cx-icon>
          </cx-input>
          <div className="browser__folders">
            <cx-tree ref={treeRef} force-on-change>
              {renderFolders()}
              {folders && folders.length < totalCount && !isLoadingFolders && (
                <LoadMoreButton
                  loadMore={loadMore}
                  isLoading={isFetchingFolders}
                  disabled={isFetchingFolders}
                />
              )}
            </cx-tree>
          </div>
        </cx-space>
        {showCollections && (
          <div className="browser__collections">
            <cx-details>
              <cx-typography slot="summary" variant="body3">
                Collections
              </cx-typography>
              <cx-menu
                ref={collectionRef}
                className="browser__collections__menu"
              >
                {renderCollections()}
                {collections &&
                  collections.length < totalCollectionCount &&
                  !isLoadingCollections && (
                    <LoadMoreButton
                      loadMore={loadMoreCollections}
                      isLoading={isFetchingCollections}
                      disabled={isFetchingCollections}
                      disabledIndentation
                    />
                )}
              </cx-menu>
            </cx-details>
          </div>
        )}
      </cx-space>
    </Drawer>
  );
};

export default Browser;
