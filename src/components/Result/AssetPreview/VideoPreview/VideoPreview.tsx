import { FC, useCallback, useEffect, useRef, useState } from 'react';

import { CxProgressBar } from '@/web-component';

type Props = {
  url: string;
  thumbnailOnly: boolean;
  thumbnailUrl: string;
  onError: () => void;
  onLoaded: () => void;
};

const ViewPreview: FC<Props> = ({
  url,
  thumbnailOnly = false,
  thumbnailUrl,
  onError,
  onLoaded,
}) => {
  const [assetDirection, setAssetDirection] = useState<'vertical' | 'horizontal'>('horizontal');
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<CxProgressBar>(null);

  useEffect(() => {
    if (thumbnailOnly) {
      return;
    }

    const container = containerRef.current?.parentElement;
    const video = videoRef.current;
    const progressBar = progressBarRef.current;

    if (!container || !video || !progressBar) {
      return;
    }


    const onMouseEnter = (e: MouseEvent) => {
      if (video.duration) {
        progressBar.value = (e.offsetX / progressBar.offsetWidth) * 100;
        video.currentTime =
          (e.offsetX / progressBar.offsetWidth) * video.duration;
      }
    };

    const onMouseLeave = () => {
      progressBar.value = 0;
      video.currentTime = 0;
      video.pause();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (video.duration) {
        progressBar.value = (e.offsetX / progressBar.offsetWidth) * 100;
        video.currentTime =
          (e.offsetX / progressBar.offsetWidth) * video.duration;
      }
    };

    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('mousemove', onMouseMove);

    return () => {
      container.removeEventListener('mouseenter', onMouseEnter);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('mousemove', onMouseMove);
    };
  }, [thumbnailOnly, thumbnailUrl]);

  const onLoadAsset = useCallback(() => {
    onLoaded();

    if (videoRef.current) {
      const { videoWidth, videoHeight } = videoRef.current;
      setAssetDirection(videoWidth > videoHeight ? 'horizontal' : 'vertical');
    }

    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      setAssetDirection(naturalWidth > naturalHeight ? 'horizontal' : 'vertical');
    }
  }, [onLoaded]);

  return (
    <div
      ref={containerRef}
      className={`asset-preview__representative asset-preview__representative--${assetDirection}`}
    >
      {url && !thumbnailOnly ? (
        <video
          ref={videoRef}
          src={url}
          poster={thumbnailUrl}
          onLoadedMetadata={onLoadAsset}
          onError={() => {
            onError();
          }}
        >
          <track default kind="captions" srcLang="en" />
        </video>
      ) : (
        <img
          ref={imageRef}
          src={thumbnailUrl}
          alt="Asset preview"
          onLoad={onLoadAsset}
          onError={onError}
        />
      )}
      <div className="asset-preview__video-icon">
        <cx-icon name="play_arrow" variant="filled"></cx-icon>
      </div>
      {
        !thumbnailOnly && (
          <cx-progress-bar
            ref={progressBarRef}
            className="asset-preview__progress-bar"
          ></cx-progress-bar>
        )
      }
    </div>
  );
};

export default ViewPreview;
