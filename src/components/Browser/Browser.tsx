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
  CxMenuItem,
  CxSelectEvent,
  CxSelectionChangeEvent,
  CxTree,
  CxTreeItem,
} from '@orangelogic-private/design-system';
import { skipToken } from '@reduxjs/toolkit/query';

import { Drawer } from './Browser.styled';
import BrowserItem, { getHighlightedTitle } from './BrowserItem';
import { FOLDER_PAGE_SIZE } from '@/utils/constants';
import LoadMoreButton from './LoadMoreButton';
import { LeftPanelCloseIcon, LeftPanelOpenIcon } from './Browser.constants';
import { constructIconDataUrl } from '@/utils/icon';
import _uniqBy from 'lodash-es/uniqBy';
import LineClamp from '../LineClamp';

const defaultFavoriteFolder = {
  id: '',
  title: 'My Favorites',
  docType: 'Story',
  path: [],
  parents: [],
  fullPath: 'My Favorites',
  hasChildren: false,
};

type Props = {
  allowedFolders?: string[];
  allowPin?: boolean;
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
  isPersistent: boolean;
  onChangePersistent: (persistent: boolean) => void;
  forceOverlay: boolean;
  damViewSeeThru: boolean;
};

const Browser: FC<Props> = ({
  allowedFolders,
  allowPin,
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
  isPersistent,
  onChangePersistent,
  forceOverlay,
  damViewSeeThru,
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
        setPagination((prev) => ({
          ...prev,
          start: 0,
        }));
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
      onChangePersistent(false);
    };
    drawer.addEventListener('cx-request-close', onDrawerClose);

    return () => {
      drawer.removeEventListener('cx-request-close', onDrawerClose);
    };
  }, [isDefined, onClose, onChangePersistent]);

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
    damViewSeeThru,
  });

  const { data: favoriteFolderData } = useGetFoldersQuery(
    {
      allowedFolders,
      folder: {
        ...defaultFavoriteFolder,
        id: favoriteFolderId ?? '',
      },
      searchText: '',
      useSession,
      self: true,
      includeDirectChild: false,
      damViewSeeThru,
    },
    {
      skip: !favoriteFolderId,
    },
  );

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
    const onTreeSelect = (e: CxSelectionChangeEvent<CxTreeItem>) => {
      const folder = JSON.parse(
        e.detail.selection[0].dataset.value ?? '{}',
      ) as Folder;
      onFolderSelect?.(folder);
    };
    tree.addEventListener('cx-selection-change', onTreeSelect);

    return () => {
      tree.removeEventListener('cx-selection-change', onTreeSelect);
    };
  }, [isDefined, onFolderSelect]);

  useEffect(() => {
    const collection = collectionRef.current;
    if (!collection) return;
    const onCollectionSelect = (e: CxSelectEvent<CxMenuItem>) => {
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
              ...defaultFavoriteFolder,
              id: favoriteFolderId,
              hasChildren: favoriteFolderData?.items?.[0]?.hasChildren ?? false,
            }}
            currentFolderID={currentFolder.id}
            icon="star"
            useSession={useSession}
            damViewSeeThru={damViewSeeThru}
          />,
        );
      }

      return [
        ...result,
        ...(_uniqBy(folders, folder => folder.id) ?? []).map((folder) => (
          <BrowserItem
            key={folder.id}
            allowedFolders={allowedFolders}
            folder={folder}
            currentFolderID={currentFolder.id}
            searchText={searchText}
            useSession={useSession}
            damViewSeeThru={damViewSeeThru}
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
    favoriteFolderData,
    damViewSeeThru,
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
            <LineClamp lines={1}>
              {getHighlightedTitle(collection.title, searchText)}
            </LineClamp>
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

  const IconHeaderMapper = {
    'persistent': {
      src: constructIconDataUrl(LeftPanelCloseIcon),
      onclick: () => {
        onClose();
        onChangePersistent(false);
      },
    },
    'overlay': {
      src: constructIconDataUrl(LeftPanelOpenIcon),
      onclick: () => onChangePersistent(true),
    },
  };

  
  const IconHeaderProps = isPersistent ? IconHeaderMapper.persistent : IconHeaderMapper.overlay;
  const variant = forceOverlay || !isPersistent ? 'overlay' : 'persistent';
  const noCloseButton = !forceOverlay && isPersistent;

  return (
    <Drawer
      ref={drawerRef}
      label="Browser"
      placement="start"
      contained
      open={open}
      variant={variant}
      noCloseButton={noCloseButton}
    >
      {!forceOverlay && allowPin ? (
        <cx-tooltip slot="header-actions" content={isPersistent ? 'Collapse menu' : 'Expand menu'}>
          <cx-icon-button {...IconHeaderProps}></cx-icon-button>
        </cx-tooltip>
      ) : null}
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
