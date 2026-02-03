import { CSSProperties, FC, useCallback, useRef, useState } from 'react';

import OtherPreview from '@/components/Result/AssetPreview/OtherPreview';
import { MediaType } from '@/types/search';

import { Container } from './Previewer.styled';

type Props = {
  loadable: boolean;
  asset: {
    docType?: MediaType;
    imageUrl?: string;
    videoUrl?: string;
    extension?: string;
  };
  onLoad?: ({ width, height }: { width: number, height: number }) => void;
};

const Previewer: FC<Props> = ({
  loadable,
  asset = {
    docType: MediaType.Image,
    imageUrl: '',
  },
  onLoad,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadFailed, setIsLoadFailed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [assetDirection, setAssetDirection] = useState<'vertical' | 'horizontal'>('horizontal');

  const onLoadAsset = useCallback((rect: { width: number, height: number }) => {
    if (onLoad) {
      onLoad(rect);
    }

    setAssetDirection(rect.width > rect.height ? 'horizontal' : 'vertical');
  }, [onLoad]);

  const renderPreview = useCallback(() => {
    if (!loadable) {
      return;
    }

    const otherPreview = (
      <OtherPreview
        type={asset.docType}
        style={
          {
            '--text-font-size': 'var(--cx-font-size-x-large)',
            '--icon-font-size': '56px',
            '--gap': 'var(--cx-spacing-small)',
          } as CSSProperties
        }
      >
        {asset.extension?.toUpperCase() ?? asset.docType}
      </OtherPreview>
    );

    if (isLoadFailed) {
      return otherPreview;
    }

    if (asset.docType === MediaType.Video && asset.videoUrl) {
      return (
        <video
          src={asset.videoUrl}
          controls
          controlsList="nodownload noremoteplayback noplaybackrate"
          disablePictureInPicture
          disableRemotePlayback
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            width: assetDirection === 'horizontal' ? '100%' : 'auto',
            height: assetDirection === 'vertical' ? '100%' : 'auto',
          }}
          onLoadedMetadata={(e) => {
            setIsLoading(false);
            onLoadAsset({
              width: e.currentTarget.videoWidth,
              height: e.currentTarget.videoHeight,
            });
          }}
          onError={() => {
            setIsLoading(false);
            setIsLoadFailed(true);
          }}
        >
        </video>
      );
    }

    if (asset.docType === MediaType.Image || asset.imageUrl) {
      return (
        <img
          ref={imageRef}
          src={asset.imageUrl}
          alt={asset.docType}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            width: assetDirection === 'horizontal' ? '100%' : 'auto',
            height: assetDirection === 'vertical' ? '100%' : 'auto',
          }}
          onLoad={() => {
            if (!imageRef.current) {
              return;
            }
            setIsLoading(false);
            onLoadAsset({
              width: imageRef.current.naturalWidth,
              height: imageRef.current.naturalHeight,
            });
          }}
          onError={() => {
            setIsLoading(false);
            setIsLoadFailed(true);
          }}
        />
      );
    }

    return otherPreview;
  }, [asset.docType, asset.extension, asset.imageUrl, asset.videoUrl, assetDirection, isLoadFailed, loadable, onLoadAsset]);

  return (
      <Container ref={containerRef}>
        {renderPreview()}
        {isLoading && (
          <div className="loading">
            <cx-skeleton className="loading__skeleton"></cx-skeleton>
            <cx-spinner className="loading__spinner"></cx-spinner>
          </div>
        )}
      </Container>
  );
};

export default Previewer;
