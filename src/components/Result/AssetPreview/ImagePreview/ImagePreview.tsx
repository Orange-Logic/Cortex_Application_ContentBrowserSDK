import { FC } from 'react';

type Props = {
  alt: string;
  url: string;
  loaded: boolean;
  originalUrl?: string;
  onError: () => void;
  onLoaded: () => void;
};

const ImagePreview: FC<Props> = ({
  alt,
  url,
  loaded,
  originalUrl,
  onError,
  onLoaded,
}) => {
  return (
    <div className={originalUrl && loaded ? 'asset-preview__representative-container' : undefined}>
      <img
        className="asset-preview__representative"
        src={url}
        alt={alt}
        onLoad={onLoaded}
        onError={onError}
      />
      {originalUrl && (
        <img
          className="asset-preview__representative asset-preview__representative--animated"
          src={originalUrl}
          alt={alt}
          onLoad={onLoaded}
          onError={onError}
        />
      )}
    </div>
  );
};

export default ImagePreview;