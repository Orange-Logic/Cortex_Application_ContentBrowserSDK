import { FC, useCallback, useState } from 'react';

import { Asset, MediaType } from '@/types/search';

import { Container } from './AssetPreview.styled';
import ImagePreview from './ImagePreview';
import VideoPreview from './VideoPreview';
import OtherPreview from './OtherPreview';

type Props = {
  asset: Asset;
  imageLoaded: boolean;
  slot: string;
  thumbnailOnly: boolean;
  onLoaded: () => void;
};

const AssetPreview: FC<Props> = ({
  asset,
  imageLoaded,
  slot,
  thumbnailOnly,
  onLoaded,
}) => {
  const [isError, setIsError] = useState(false);
  
  const renderPreview = useCallback(() => {
    const isUrlFilled = typeof asset.imageUrl === 'string' && asset.imageUrl.length > 0;

    if (asset.inColdStorage) {
      return (
        <OtherPreview icon="mode_cool">
          Asset in Cold Storage
          <br></br>
          <small>(no preview available)</small>
        </OtherPreview>
      );
    }

    if (isError || !isUrlFilled) {
      return (
        <OtherPreview type={asset.docType}>
          {asset.extension?.toUpperCase() || asset.docType}
        </OtherPreview>
      );
    }

    if (asset.docType === MediaType.Video) {
      return (
        <VideoPreview
          url={asset.scrubUrl}
          thumbnailOnly={thumbnailOnly}
          thumbnailUrl={asset.imageUrl}
          loaded={imageLoaded}
          onLoaded={onLoaded}
          onError={() => setIsError(true)}
        />
      );
    }

    return (
      <ImagePreview
        alt={asset.name}
        url={asset.imageUrl}
        originalUrl={asset.extension === '.gif' && asset.originalUrl ? asset.originalUrl : undefined}
        loaded={imageLoaded}
        onLoaded={onLoaded}
        onError={() => setIsError(true)}
      />
    );
  }, [asset, isError, onLoaded, thumbnailOnly, imageLoaded]);

  return (
    <Container slot={slot} className={`asset-preview ${asset.inColdStorage ? 'asset-preview--disabled' : ''}`}>
      {
        !imageLoaded && !asset.inColdStorage && (
          <cx-skeleton
            slot="image"
            className="asset-preview__image-skeleton"
          ></cx-skeleton>
        )
      }
      {renderPreview()}
    </Container>
  );
};

export default AssetPreview;
