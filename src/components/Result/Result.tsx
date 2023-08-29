import { Alert, Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useGetImagesQuery } from '../../store/search/search.api';
import { getExtraFields } from '../../store/search/search.slice';
import { AssetImage, Folder } from '../../types/search';
import { PAGE_SIZE } from '../../utils/constants';
import { ResultAssetCardWraper } from './ResultAssetCard';

type ResultsProps = {
  isSeeThrough: boolean;
  currentFolder: Folder;
  searchText: string;
  handleSelectItem: any;
  selectedAssets: AssetImage[];
  setTotalCount: (totalCount: number) => void;
  setCurrentCount: (currentCount: number) => void;
};

const Results = ({ currentFolder, searchText, handleSelectItem, selectedAssets, isSeeThrough, setTotalCount, setCurrentCount }: ResultsProps) => {
  const scrollTarget = useRef<Node | Window | undefined>();
  const [page, setPage] = useState(0);
  const [seeThru, setSeeThru] = useState(isSeeThrough);

  const { data, isFetching, isLoading, isError } = useGetImagesQuery({
    folderID: currentFolder.id,
    searchText: searchText,
    page,
    isSeeThrough: seeThru,
  });

  useEffect(() => {
    setSeeThru(isSeeThrough);
    setPage(0);
  }, [isSeeThrough]);

  useEffect(()=>{
    setTotalCount(data?.totalCount || 0);
  }, [data?.totalCount, setTotalCount]);

  useEffect(()=>{
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
      {({ height, width }: any) => (
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

export default Results;
