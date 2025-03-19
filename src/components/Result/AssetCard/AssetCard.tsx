import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import ArrayClamp from '@/components/ArrayClamp';
import { ImageCardDisplayInfo } from '@/GlobalConfigContext';
import { Asset, GridView, MediaType } from '@/types/search';
import { isNullOrWhiteSpace } from '@/utils/string';

import AssetPreview from '../AssetPreview';
import { Card } from './AssetCard.styled';

type Props = {
  id: string;
  asset: Asset;
  displayInfo: ImageCardDisplayInfo & { searchInDrive: boolean };
  isSelected: boolean;
  view: GridView;
  onItemSelect: (asset: Asset) => void;
  onMount?: (id: string) => void;
  onLoaded?: (id: string) => void;
};

const AssetCard: FC<Props> = ({
  id,
  asset,
  displayInfo,
  isSelected,
  view,
  onItemSelect,
  onMount,
  onLoaded,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const previewLoaded = imageLoaded || (asset.docType !== MediaType.Image && asset.docType !== MediaType.Video);

  const onPreviewLoaded = useCallback(() => {
    setImageLoaded(true);
    if (onLoaded) {
      onLoaded(id);
    }
  }, [id, onLoaded]);

  useEffect(() => {
    if (onMount) {
      onMount(id);
    }
  }, [onMount, id]);

  const tags = useMemo(() => {
    return asset?.tags.length > 0 ? asset?.tags.split(',').map((s) => s.trim()) : [];
  }, [asset?.tags]);

  const getTagTitle = useCallback((index: number) => {
    if (displayInfo.tags && tags) {
      return tags[index] || '';
    }
    return '';
  }, [displayInfo.tags, tags]);

  return (
    <Card
      className={`asset-card ${isSelected ? 'selected' : ''}`}
      onClick={() => {
        onItemSelect(asset);
      }}
    >
      <AssetPreview
        slot="image"
        asset={asset}
        imageLoaded={previewLoaded}
        thumbnailOnly={view === GridView.Small}
        onLoaded={onPreviewLoaded}
      />
      {isSelected && (
        <div slot="image" className="asset-card__checkbox">
          <cx-checkbox checked></cx-checkbox>
        </div>
      )}
      <cx-space>
        {displayInfo.title && (
          <cx-line-clamp lines={1} className="asset-card__name">
            {asset.name}
          </cx-line-clamp>
        )}
        {displayInfo.searchInDrive && (
          <cx-tooltip content="Open in drive">
            <cx-icon-button name="folder" size="small" className="asset-card__button"></cx-icon-button>
          </cx-tooltip>
        )}
      </cx-space>
      {displayInfo.tags && tags.length > 0 && (
        <ArrayClamp
          className="asset-card__tags"
          separator=" "
          tooltipSeparator=", "
          getChildString={getTagTitle}
        >
          {tags
            ?.filter((tag) => !isNullOrWhiteSpace(tag))
            .slice(0, 5)
            .map((tag) => (
              <cx-tag
                key={tag.toLowerCase()}
                size="small"
                variant="neutral"
                pill
              >
                <cx-line-clamp lines={1}>{tag}</cx-line-clamp>
              </cx-tag>
            ))}
        </ArrayClamp>
      )}
      {(displayInfo.dimension || displayInfo.fileSize) && (
        <cx-space spacing="small" alignItems="center" wrap="nowrap">
          {displayInfo.dimension && Boolean(Number(asset.width)) && Boolean(Number(asset.height)) && (
            <cx-line-clamp lines={1}>
              <cx-typography variant="small">
                <span>{asset.width}</span>x<span>{asset.height}</span>
              </cx-typography>
            </cx-line-clamp>
          )}
          {displayInfo.fileSize && (
            <cx-line-clamp lines={1}>
              <cx-typography variant="small">
                {asset.size}
              </cx-typography>
            </cx-line-clamp>
          )}
        </cx-space>
      )}
      {/* Placeholder to keep the card size consistent */}
      {displayInfo.tags && tags.length === 0 && (
        <ArrayClamp
          className="asset-card__tags"
          separator=" "
          tooltipSeparator=", "
          getChildString={getTagTitle}
        >
          <span></span>
        </ArrayClamp>
      )}
    </Card>
  );
};

export default AssetCard;
