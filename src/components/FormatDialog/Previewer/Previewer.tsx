import { CSSProperties, FC, useCallback, useEffect, useRef, useState } from 'react';

import OtherPreview from '@/components/Result/AssetPreview/OtherPreview';
import { MediaType } from '@/types/search';

import { Container } from './Previewer.styled';

type Props = {
  loadable: boolean;
  asset: {
    docType?: MediaType;
    imageUrl?: string;
    videoUrl?: string;
  };
  isError?: boolean;
  isFetching?: boolean;
  onLoad?: ({ width, height }: { width: number, height: number }) => void;
};

const Previewer: FC<Props> = ({
  loadable,
  asset = {
    docType: MediaType.Image,
    imageUrl: '',
  },
  isError = false,
  isFetching,
  onLoad,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (asset.imageUrl || isFetching) {
      setIsLoading(true);
    }
  }, [asset.imageUrl, isFetching]);

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
      />
    );

    if (isError) {
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
          }}
          onLoadedMetadata={(e) => {
            setIsLoading(false);
            onLoad?.({
              width: e.currentTarget.videoWidth,
              height: e.currentTarget.videoHeight,
            });
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
          }}
          onLoad={() => {
            if (!imageRef.current) {
              return;
            }
            setIsLoading(false);
            onLoad?.({
              width: imageRef.current.naturalWidth,
              height: imageRef.current.naturalHeight,
            });
          }}
        />
      );
    }

    return otherPreview;
  }, [asset.docType, asset.imageUrl, asset.videoUrl, isError, loadable, onLoad]);

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
