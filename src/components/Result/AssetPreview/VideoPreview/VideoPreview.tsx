import { FC, useEffect, useRef } from 'react';

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
  const containerRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.addEventListener('loadeddata', onLoaded);

    return () => {
      video.removeEventListener('loadeddata', onLoaded);
    };
  }, [thumbnailOnly, onLoaded]);

  return (
    <div ref={containerRef}>
      {url && !thumbnailOnly ? (
        <video
          ref={videoRef}
          className="asset-preview__representative"
          src={url}
          poster={thumbnailUrl}
          onError={() => {
            onLoaded();
          }}
        >
          <track default kind="captions" srcLang="en" />
        </video>
      ) : (
        <img
          className="asset-preview__representative"
          src={thumbnailUrl}
          alt="Asset preview"
          onLoad={onLoaded}
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
