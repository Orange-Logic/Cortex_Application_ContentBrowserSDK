import styled from 'styled-components';

import { ASSET_SIZE } from '@/consts/asset';
import type { CxCardProps } from '@orangelogic/design-system/react-types';
import { GridView } from '@/types/search';

export const Card = styled('cx-card')<CxCardProps>`
  &.asset-card {
    --border-color: transparent;
    --border-radius: 0;
    --border-width: 0;
    --padding: 0;
    --image-border-radius: var(--cx-border-radius-medium);
    width: 100%;

    &::part(base) {
      box-shadow: none;
      cursor: pointer;
      overflow: hidden;
    }

    &::part(image) {
      aspect-ratio: 246/180;
      position: relative;
    }

    &::part(body) {
      padding: var(--cx-spacing-x-small);
    }

    &.selected {
      --border-color: var(--cx-color-primary);
    }

    cx-divider {
      --color: var(--cx-color-neutral-500);
      --spacing: 0;
      --width: 10px;
    }

    cx-space {
      justify-content: space-between;
    }

    &.asset-card--disabled {
      cursor: default;
      pointer-events: none;
    }

    &.asset-card--small {
      max-width: ${ASSET_SIZE[GridView.Small].maxWidth}px;
    }

    &.asset-card--medium {
      max-width: ${ASSET_SIZE[GridView.Medium].maxWidth}px;
    }

    &.asset-card--large {
      max-width: ${ASSET_SIZE[GridView.Large].maxWidth}px;
    }
  }

  .asset-card__checkbox {
    background-color: var(--cx-color-neutral-0);
    border-top-right-radius: var(--cx-border-radius-medium);
    border-bottom-left-radius: var(--cx-border-radius-medium);
    position: absolute;
    top: var(--cx-spacing-3x-small);
    right: var(--cx-spacing-3x-small);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;

    cx-checkbox {
      line-height: normal;

      &::part(label) {
        display: none;
      }
    }
  }

  .asset-card__name {
    flex: 1;
    font-size: var(--cx-font-size-small);

    &::part(content) {
      word-break: break-all;
    }
  }

  .asset-card__name--right {
    text-align: right;
  }

  .asset-card__button {
    &::part(base) {
      font-size: var(--cx-font-size-medium);
      padding: 0;
    }
  }

  .asset-card__tags {
    /* display: flex;
    gap: var(--cx-spacing-3x-small); */
    width: 100%;
    height: 24px;

    cx-tag {
      max-width: 100%;
    }
  }

  .asset-card__info {
    color: var(--cx-color-neutral-500);

    * {
      line-height: var(--cx-line-height-small);
    }

    .asset-card__placeholder {
      visibility: hidden;
    }
  }
`;