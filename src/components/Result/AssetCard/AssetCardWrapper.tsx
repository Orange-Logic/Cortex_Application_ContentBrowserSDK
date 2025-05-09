import { forwardRef, useCallback, useContext, useMemo, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry from 'react-responsive-masonry';

import NoResult from '@/components/NoResult';
import { GlobalConfigContext } from '@/GlobalConfigContext';
import { Asset, GridView } from '@/types/search';

import AssetCard from './AssetCard';
import { Container } from './AssetCardWrapper.styled';
import { ASSET_SIZE } from '@/consts/asset';

type Props = {
  // Are there more items to load?
  // (This information comes from the most recent API request.)
  hasNextPage: boolean;
  height: number;
  // Array of items loaded so far.
  items: Asset[];
  isConfigError?: boolean;
  isError?: boolean;
  isFetched?: boolean;
  // Are we currently loading a page of items?
  // (This may be an in-flight flag in your Redux store for example.)
  isLoadingData: boolean;
  selectedAsset: Asset | null;
  view: GridView;
  width: number;
  onItemSelect: (selectedAsset: Asset) => void;
  // Callback function responsible for loading the next page of items.
  onLoadMore: () => void;
  onScroll: (e: MouseEvent) => void;
};

export const AssetCardWrapper = forwardRef<HTMLDivElement, Props>(({
  hasNextPage,
  height,
  isConfigError,
  isError,
  isFetched,
  isLoadingData,
  items,
  selectedAsset,
  view,
  width,
  onItemSelect,
  onLoadMore,
  onScroll,
}, ref) => {
  const { displayInfo, searchInDrive } = useContext(GlobalConfigContext);
  const infiniteScrollRef = useRef<InfiniteScroll>(null);
  const gutter = useMemo(() => {
    return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cx-spacing-medium'), 10);
  }, []);

  const calculateColumnCount = useCallback(() => {
    const actualWidth = infiniteScrollRef.current?.getScrollableTarget()?.children[0].clientWidth ?? width;
    const breakPoint = ASSET_SIZE[view]?.minWidth || ASSET_SIZE[GridView.Large].minWidth;
    return Math.max(1, Math.floor((actualWidth + gutter) / (breakPoint + gutter)));
  }, [gutter, view, width]);


  const renderContent = useCallback(() => {
    if (items.length > 0) {
      return (
        <InfiniteScroll
          dataLength={items.length}
          hasMore={hasNextPage}
          loader={null}
          ref={infiniteScrollRef}
          scrollableTarget="scrollableDiv"
          style={{ overflow: 'visible' }}
          next={onLoadMore}
          onScroll={onScroll}
        >
          <Masonry columnsCount={calculateColumnCount()} gutter={`${gutter}px`} className='asset-card__masonry'>
            {items.map((item) => (
              <AssetCard
                id={item.id}
                key={item.id}
                asset={item}
                displayInfo={{
                  ...displayInfo,
                  searchInDrive,
                }}
                view={view}
                isSelected={selectedAsset?.id === item.id}
                onItemSelect={onItemSelect}
              />
            ))}
          </Masonry>
        </InfiniteScroll>
      );
    } else if (!isLoadingData) {
      return (
        <div className="wrapper__content__empty">
          <NoResult icon="search_off" message="No matching results" />
        </div>
      );
    }

    return null;
  }, [
    hasNextPage,
    isLoadingData,
    items,
    selectedAsset?.id,
    view,
    displayInfo,
    gutter,
    searchInDrive,
    calculateColumnCount,
    onItemSelect,
    onLoadMore,
    onScroll,
  ]);

  if (isConfigError && isFetched) {
    return (
      <NoResult
        icon="error_outline"
        message="The Content Browser was loaded with incorrect configuration(s). Please update the configuration and try again."
      />
    );
  }

  if (isError && isFetched) {
    return (
      <NoResult
        icon="error_outline"
        message="Something went wrong. Please try again later."
      />
    );
  }

  return (
    <Container className="wrapper" ref={ref}>
      <div
        style={{
          position: 'absolute',
          width: '100%',
          opacity: isLoadingData ? 1 : 0,
          zIndex: 'var(--cx-z-index-drawer)',
        }}
      >
        <cx-progress-bar
          className="wrapper__progress-bar"
          indeterminate
        ></cx-progress-bar>
      </div>
      <div
        className="wrapper__content"
        style={{
          width: width,
          height: height,
        }}
        id="scrollableDiv"
      >
        {renderContent()}
      </div>
    </Container>
  );
});

export default AssetCardWrapper;