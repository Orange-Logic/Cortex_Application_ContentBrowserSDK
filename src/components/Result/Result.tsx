import AutoSizer, { Size } from 'react-virtualized-auto-sizer';

import NoResult from '@/components/NoResult';
import { Asset, GridView } from '@/types/search';

import AssetCardWrapper from './AssetCard';
import { Container } from './Result.styled';

type ResultsProps = {
  items: Asset[];
  isError: boolean;
  isLoading: boolean;
  hasNextPage: boolean;
  selectedAsset: Asset | null;
  view: GridView;
  onItemSelect: (selectedAsset: Asset) => void;
  onLoadMore: () => void;
  onScroll: (e: MouseEvent) => void;
};

const Results = ({
  selectedAsset,
  view,
  hasNextPage,
  items,
  isError,
  isLoading,
  onItemSelect,
  onLoadMore,
  onScroll,
}: ResultsProps) => {
  if (isError) {
    return (
      <NoResult
        icon="error_outline"
        message="Something went wrong. Please try again later."
      />
    );
  }

  return (
    <Container>
      <AutoSizer>
        {({ height, width }: Size) => (
          <AssetCardWrapper
            hasNextPage={hasNextPage}
            height={height}
            isLoadingData={isLoading}
            items={items ?? []}
            selectedAsset={selectedAsset}
            view={view}
            width={width}
            onItemSelect={onItemSelect}
            onLoadMore={onLoadMore}
            onScroll={onScroll}
          />
        )}
      </AutoSizer>
    </Container>
  );
};

export default Results;
