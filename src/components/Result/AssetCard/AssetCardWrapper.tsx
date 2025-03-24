import { FC, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry from 'react-responsive-masonry';

import NoResult from '@/components/NoResult';
import { GlobalConfigContext } from '@/GlobalConfigContext';
import { Asset, GridView } from '@/types/search';

import AssetCard from './AssetCard';
import { Container } from './AssetCardWrapper.styled';

type Props = {
  // Are there more items to load?
  // (This information comes from the most recent API request.)
  hasNextPage: boolean;
  height: number;
  // Array of items loaded so far.
  items: Asset[];
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

export const AssetCardWrapper: FC<Props> = ({
  hasNextPage,
  height,
  isLoadingData,
  items,
  selectedAsset,
  view,
  width,
  onItemSelect,
  onLoadMore,
  onScroll,
}) => {
  const { displayInfo, searchInDrive } = useContext(GlobalConfigContext);
  const ref = useRef<InfiniteScroll>(null);
  const gutter = useMemo(() => {
    return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cx-spacing-medium'), 10);
  }, []);

  const calculateColumnCount = useCallback(() => {
    const actualWidth = ref.current?.getScrollableTarget()?.children[0].clientWidth ?? width;
    if (view === GridView.Small) {
      return Math.max(1, Math.floor((actualWidth + gutter) / (130 + gutter)));
    } else if (view === GridView.Medium) {
      return Math.max(1, Math.floor((actualWidth + gutter) / (190 + gutter)));
    } else {
      return Math.max(1, Math.floor((actualWidth + gutter) / (302 + gutter)));
    }
  }, [gutter, view, width]);

  useEffect(() => {
    const handleResize = () => {
      let breakpoint = 0;
      if (view === GridView.Small) {
        breakpoint = 130;
      } else if (view === GridView.Medium) {
        breakpoint = 190;
      } else {
        breakpoint = 302;
      }



      if (hasNextPage) {
        const columnCount = calculateColumnCount();
        const rowCount = Math.ceil(items.length / columnCount);
        const rowGap = gutter;
        const visibleRowCount = Math.ceil(height / (breakpoint + rowGap));
        if (rowCount < visibleRowCount) {
          onLoadMore();
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [width, height, view, hasNextPage, items.length, onLoadMore, calculateColumnCount, gutter]);

  const renderContent = useCallback(() => {
    if (items.length > 0) {
      return (
        <InfiniteScroll
          dataLength={items.length}
          hasMore={hasNextPage}
          loader={null}
          ref={ref}
          scrollableTarget="scrollableDiv"
          style={{ overflow: 'visible' }}
          next={onLoadMore}
          onScroll={onScroll}
        >
          <Masonry columnsCount={calculateColumnCount()} gutter={`${gutter}px`}>
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

  return (
    <Container className="wrapper">
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
};

export default AssetCardWrapper;