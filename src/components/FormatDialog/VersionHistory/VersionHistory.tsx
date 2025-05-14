import { FC, useCallback, useRef, useState } from 'react';

import { Container } from './VersionHistory.styled';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetVersionHistoryQuery } from '@/store/assets/assets.api';

type Props = {
  assetId?: string;
};

const VersionImage: FC<{
  src: string;
  alt: string;
}> = ({ src, alt }) => {
  const [assetDirection, setAssetDirection] = useState<'vertical' | 'horizontal'>('horizontal');

  const imageRef = useRef<HTMLImageElement>(null);

  const onLoadAsset = useCallback(() => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      setAssetDirection(naturalWidth > naturalHeight ? 'horizontal' : 'vertical');
    }
  }, []);

  return (
    <div className={`version__item__preview version__item__preview--${assetDirection}`}>
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        onLoad={onLoadAsset}
      />
    </div>
  );
};

const VersionVideo: FC<{
  src: string;
}> = ({ src }) => {
  const [assetDirection, setAssetDirection] = useState<'vertical' | 'horizontal'>('horizontal');

  const videoRef = useRef<HTMLVideoElement>(null);

  const onLoadAsset = useCallback(() => {
    if (videoRef.current) {
      const { videoWidth, videoHeight } = videoRef.current;
      setAssetDirection(videoWidth > videoHeight ? 'horizontal' : 'vertical');
    }
  }, []);

  return (
    <div className={`version__item__preview version__item__preview--${assetDirection}`}>
      <video
        ref={videoRef}
        src={src}
        onLoadedMetadata={onLoadAsset}
        controls
      >
      </video>
    </div>
  );
};

const VersionHistory: FC<Props> = ({ assetId }) => {
  const { data, isFetching, isLoading } = useGetVersionHistoryQuery(assetId ? {
    assetId,
  } : skipToken);

  if (isFetching || isLoading) {
    return (
      <Container>
        <cx-spinner></cx-spinner>
      </Container>
    );
  }

  return (
    <Container>
      <cx-menu>
        {data?.versions?.map((version, index) => (
          <cx-menu-item key={version.versionNumber} className="version__item" readonly>
            <cx-grid columns={5} spacing="12px">
              <cx-grid-item xs="2" sm="2">
                <cx-space direction="horizontal" align-items="center" wrap="nowrap">
                  <div className="version__item__number">
                    <cx-line-clamp lines={1}>
                      {version.versionNumberDisplay}
                    </cx-line-clamp>
                  </div>
                  {
                    version.scrubUrl ? (
                      <VersionVideo
                        src={version.scrubUrl}
                      />
                    ) : (
                      <VersionImage
                        src={version.versionFileUrl}
                        alt={version.versionFileName}
                      />
                    )
                  }
                </cx-space>
              </cx-grid-item>
              <cx-grid-item xs="2" sm="3">
                <cx-space direction="vertical" spacing="2x-small">
                  <cx-line-clamp lines={1}>
                    <cx-typography variant="body2" className="version__item__name">{version.versionFileName}</cx-typography>
                  </cx-line-clamp>
                  <cx-line-clamp lines={1}>
                    <cx-typography variant="body2">{version.createByEmail}</cx-typography>
                  </cx-line-clamp>
                  <cx-typography variant="body2">
                    {version.versionCreateDate.split(' ')[0]}
                    {index === 0 && (
                      <span className="version__item__latest">Current version</span>
                    )}
                  </cx-typography>
                </cx-space>
              </cx-grid-item>
            </cx-grid>
          </cx-menu-item>
        ))}
      </cx-menu>
    </Container>
  );
};

export default VersionHistory;