import CheckBoxIcon from '@mui/icons-material/CheckBox';
import {
  Button,
  Card,
  CardMedia,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useContext, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry from 'react-responsive-masonry';
import { GlobalConfigContext } from '../../GlobalConfigContext';
import { AssetImage } from '../../types/search';
import {
  CortexColors,
  MISSING_IMAGE_PLACEHOLDER_BASE64,
} from '../../utils/constants';
import { IsNullOrWhiteSpace } from '../../utils/string';
import { NoResult } from '../NoResult';
import ResultLoadingSkeleton from './ResultLoadingSkeleton';

type ResultAssetCardProps = {
  image: AssetImage;
  setLoadCounter: (callback: (counter: number) => number) => void;
  handleSelectItem: (image: AssetImage) => void;
  isSelected: boolean;
};

const ResultAssetCard = ({ image, setLoadCounter, handleSelectItem, isSelected }: ResultAssetCardProps) => {
  const { displayInfo } = useContext(GlobalConfigContext);
  const [imageLoaded, setImageLoaded] = useState(false);

  const onImageLoaded = () => {
    setImageLoaded(true);
    setLoadCounter((counter: number) => counter - 1);
  };

  useEffect(() => {
    setLoadCounter((counter: number) => counter + 1);
  }, []);

  if (!image) {
    return <ResultLoadingSkeleton />;
  }

  const tags = image?.tags?.split(',').map((s) => s.trim()) ?? [];
  const isImgUrlFilled = typeof image.imageUrl === 'string' && image.imageUrl.length > 0;

  return (
    <Box
      key={image.id}
      sx={{ cursor: 'pointer', flex: '0 0 auto' }}
      onClick={() => {
        handleSelectItem(image);
      }}
    >
        <Card
          raised
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            border: `4px solid ${isSelected ? CortexColors.B400 : 'transparent'}`,
          }}
        >
          <Box
            sx={{
              position: 'relative',
            }}
          >
            {!imageLoaded && (
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Skeleton 
                  variant='rectangular' 
                  height={100} 
                  width='100%'>
                </Skeleton>
              </Box>
            )}
            <CardMedia
              component="img"
              image={isImgUrlFilled ? image.imageUrl : MISSING_IMAGE_PLACEHOLDER_BASE64}
              title={image.name}
              onLoad={onImageLoaded}
              onError={(e) => {
                onImageLoaded();
                ((e.target as HTMLImageElement).src = MISSING_IMAGE_PLACEHOLDER_BASE64);
              }}
            />
            {isSelected && 
              <CheckBoxIcon 
                sx={{
                  position: 'absolute',
                  right: 4,
                  top: 4,
                  zIndex: 1,
                  color: CortexColors.B500,
                  backgroundColor: CortexColors.A0,
                  borderRadius: 1,
                  width: 24,
                  height: 24,
                }}
              />
            }
            {(displayInfo.title || displayInfo.tags || displayInfo.dimension || displayInfo.fileSize) && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  padding: 2,
                }}
              >
                {displayInfo.title && (
                  <Tooltip title={image.name} placement="top-start">
                    <Typography
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: '2',
                        WebkitBoxOrient: 'vertical',
                      }}
                      variant="h5"
                      component="div"
                      color="CaptionText"
                    >
                      {image.name}
                    </Typography>
                  </Tooltip>
                )}
                {displayInfo.tags && image.tags && (
                  <Box
                    color="text.secondary"
                    sx={{
                      flexWrap: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: '1',
                      WebkitBoxOrient: 'vertical',
                      fontSize: '12px',
                    }}
                  >
                    {tags
                      .filter((tag) => !IsNullOrWhiteSpace(tag))
                      .slice(0, 5)
                      .map((tag) => (
                        <Chip
                          label={tag}
                          size="small"
                          key={tag.toLowerCase()}
                          sx={{ marginRight: 2 }}
                        />
                      ))}
                  </Box>
                )}
                {(displayInfo.dimension || displayInfo.fileSize) && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      fontSize: '14px',
                    }}
                  >
                    <Box
                      color="text.secondary"
                      sx={{
                        display: 'flex',
                        justifyContent: 'end',
                        alignItems: 'baseline',
                        gap: 2,
                      }}
                    >
                      {displayInfo.dimension && !!image.width && !!image.height && (
                        <>
                          <Typography fontSize={12} color="SecondaryText">
                            {image.width} x {image.height}
                          </Typography>
                          {displayInfo.fileSize && (
                            <Divider orientation="vertical" flexItem />
                          )}
                        </>
                      )}
                      {displayInfo.fileSize && (
                      <Typography fontSize={12} color="SecondaryText">
                        {image.size}
                      </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Card>
    </Box>
  );
};

type ResultAssetCardWraperProps = {
  // Are there more items to load?
  // (This information comes from the most recent API request.)
  hasNextPage: boolean;
  // Are we currently loading a page of items?
  // (This may be an in-flight flag in your Redux store for example.)
  isLoadingData: boolean;
  // Array of items loaded so far.
  items: AssetImage[];
  // Callback function responsible for loading the next page of items.
  loadNextPage: () => void;
  width: number;
  height: number;
  handleSelectItem: (selectedAsset: AssetImage) => void;
  selectedAssets: AssetImage[];
};

export const ResultAssetCardWraper = ({
  hasNextPage,
  isLoadingData,
  items,
  loadNextPage,
  width,
  height,
  handleSelectItem,
  selectedAssets,
}: ResultAssetCardWraperProps) => {
  const [loadCounter, setLoadCounter] = useState(0);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);

  const calculateColumnCount = () => {
    if (width < 512) {
      return 1;
    } else if (width < 768) {
      return 2;
    } else if (width < 1024) {
      return 3;
    } else {
      return 4;
    }
  };

  return !isLoadingNextPage && isLoadingData ? (
    <Box
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress />
    </Box>
  ) : (
    <Box>
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          opacity: isLoadingData || loadCounter > 0 ? 1 : 0,
        }}
      >
        <LinearProgress />
      </Box>
      <Box
        sx={{
          width: width,
          height: height,
          overflow: 'overlay',
          padding: 2,
          boxSizing: 'border-box',
        }}
        id="scrollableDiv"
      >
        {items.length > 0 ? (
          <InfiniteScroll
            style={{ overflow: 'visible' }}
            dataLength={items.length}
            next={() => {
              loadNextPage();
              setIsLoadingNextPage(true);
              setLoadCounter(0);
            }}
            hasMore={hasNextPage}
            loader={
              (isLoadingData || loadCounter > 0) && (
                <Box sx={{ width: '100%' }}>
                  <LinearProgress />
                </Box>
              )
            }
            scrollableTarget="scrollableDiv"
          >
            <Masonry columnsCount={calculateColumnCount()} gutter="16px">
              {items.map((item) => (
                <ResultAssetCard
                  image={item}
                  key={item.id}
                  setLoadCounter={setLoadCounter}
                  handleSelectItem={handleSelectItem}
                  isSelected={selectedAssets.some((asset) => asset.id === item.id)}
                />
              ))}
            </Masonry>
            <Box
              sx={{
                width: '100%',
                justifyContent: 'start',
                marginTop: 4,
                opacity: hasNextPage && !isLoadingData ? 1 : 0,
              }}
            >
              <Divider variant="middle" />
              <Button variant="text" onClick={() => {
                loadNextPage();
                setIsLoadingNextPage(true);
                setLoadCounter(0);
              }}>
                Load more items
              </Button>
            </Box>
          </InfiniteScroll>
            
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <NoResult />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ResultAssetCardWraper;
