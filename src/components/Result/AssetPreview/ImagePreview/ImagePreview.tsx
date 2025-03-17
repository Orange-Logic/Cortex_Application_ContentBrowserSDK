import { FC } from 'react';

type Props = {
  alt: string;
  url: string;
  onError: () => void;
  onLoaded: () => void;
};

const ImagePreview: FC<Props> = ({
  alt,
  url,
  onError,
  onLoaded,
}) => {
  return (
    <img
      className="asset-preview__representative"
      src={url}
      alt={alt}
      onLoad={onLoaded}
      onError={onError}
    />
  );
};

export default ImagePreview;