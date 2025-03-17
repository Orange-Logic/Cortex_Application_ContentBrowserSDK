import { CSSProperties, FC, useCallback, useEffect, useRef, useState } from 'react';

import OtherPreview from '@/components/Result/AssetPreview/OtherPreview';
import { MediaType } from '@/types/search';
import { FORMAT_DIALOG_PREVIEW_SIZE } from '@/utils/constants';

import { Container } from './Previewer.styled';

type Props = {
  loadable: boolean;
  asset: {
    docType?: MediaType;
    imageUrl?: string;
    videoUrl?: string;
  }
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
  const [height, setHeight] = useState(FORMAT_DIALOG_PREVIEW_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setIsLoading(true);
  }, [asset.imageUrl]);

  const renderPreview = useCallback(() => {
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
            setHeight(e.currentTarget.offsetHeight);
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
            opacity: isLoading ? 0 : 1,
          }}
          onLoad={() => {
            if (!imageRef.current) {
              return;
            }
            setIsLoading(false);
            setHeight(Math.min(imageRef.current.offsetHeight, FORMAT_DIALOG_PREVIEW_SIZE));
            onLoad?.({
              width: imageRef.current.naturalWidth,
              height: imageRef.current.naturalHeight,
            });
          }}
        />
      );
    }

    setIsLoading(false);
    return (
      <OtherPreview
        type={asset.docType}
        style={{
          '--text-font-size': 'var(--cx-font-size-x-large)',
          '--icon-font-size': '56px',
          '--gap': 'var(--cx-spacing-small)',
        } as CSSProperties}
      />
    );
  }, [asset.docType, asset.imageUrl, asset.videoUrl, isLoading, onLoad]);

  return (
      <Container
        ref={containerRef}
        style={{
          height: `${height}px`,
        }}
      >
        {loadable && renderPreview()}
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
