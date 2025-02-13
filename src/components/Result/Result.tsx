import { Alert, Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import AutoSizer, { Size } from 'react-virtualized-auto-sizer';
import { useAppSelector } from '../../store';
import { useGetImagesQuery } from '../../store/search/search.api';
import { getCurrentFolder, getMediaTypes, getSearchText } from '../../store/search/search.slice';
import { AssetImage, Folder, MediaType } from '../../types/search';
import { PAGE_SIZE } from '../../utils/constants';
import { ResultAssetCardWraper } from './ResultAssetCard';

type ResultsProps = {
  isSeeThrough: boolean;
  currentFolder: Folder;
  searchText: string;
  handleSelectItem: (selectedAsset: AssetImage) => void;
  selectedAssets: AssetImage[];
  setTotalCount: (totalCount: number) => void;
  setCurrentCount: (currentCount: number) => void;
  mediaTypes: MediaType[];
};

const Results = ({ currentFolder, searchText, handleSelectItem, selectedAssets, isSeeThrough, setTotalCount, setCurrentCount, mediaTypes }: ResultsProps) => {
  const scrollTarget = useRef<Node | Window>(undefined);
  const [page, setPage] = useState(0);
  const [seeThru, setSeeThru] = useState(isSeeThrough);

  const { data, isFetching, isLoading, isError } = useGetImagesQuery({
    folderID: currentFolder.id,
    searchText,
    page,
    isSeeThrough: seeThru,
    mediaTypes,
  });

  useEffect(() => {
    setSeeThru(isSeeThrough);
  }, [isSeeThrough]);

  useEffect(() => {
    setTotalCount(data?.totalCount || 0);
  }, [data?.totalCount, setTotalCount]);

  useEffect(() => {
    setCurrentCount(data?.items.length || 0);
  }, [data?.items.length, setCurrentCount]);

  if (isError) {
    return (
      <Box ref={scrollTarget}>
        <Alert severity="error">Error</Alert>
      </Box>
    );
  }

  return (
    <AutoSizer>
      {({ height, width }: Size) => (
        <ResultAssetCardWraper
          key={searchText}
          hasNextPage={data ? (page + 1) * PAGE_SIZE < data.totalCount : false}
          isLoadingData={isFetching || isLoading}
          items={data ? data.items : []}
          loadNextPage={() => setPage(page + 1)}
          width={width}
          height={height}
          handleSelectItem={handleSelectItem}
          selectedAssets={selectedAssets}
        />
      )}
    </AutoSizer>
  );
};

export const ResultsWrapper = (props: Omit<ResultsProps, 'currentFolder' | 'searchText' | 'mediaTypes'>) => {
  const currentFolder = useAppSelector(getCurrentFolder);
  const searchText = useAppSelector(getSearchText);
  const mediaTypes = useAppSelector(getMediaTypes);

  return <Results
    key={currentFolder.id + searchText + mediaTypes.join('+') + ''}
    currentFolder={currentFolder}
    searchText={searchText}
    mediaTypes={mediaTypes}
    {...props} />;
};

export default ResultsWrapper;
