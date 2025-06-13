import { CxDrawerProps } from '@/react-web-component';
import styled from 'styled-components';

export const Drawer = styled('cx-drawer')<CxDrawerProps>`
  &::part(base) {
    z-index: var(--cx-z-index-dialog);
  }

  &::part(body) {
    padding: 0;
  }

  cx-input {
    width: 100%;
  }

  cx-space {
    height: 100%;
    width: 100%;
  }

  .browser__folders {
    width: 100%;
    flex: 1;
    overflow-y: auto;
    position: relative;

    cx-tree {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  .browser__folders {
    cx-tree-item {
      &::part(label) {
        font-size: var(--cx-font-size-small);
      }
    }

    cx-skeleton {
      --border-radius: var(--cx-border-radius-medium);
      width: 100%;
      height: 32px;
      margin-bottom: var(--cx-spacing-3x-small);
    }
  }

  .browser__collections {
    border: none;
    padding: none;
    width: 100%;

    cx-details {
      &::part(base) {
        border: none;
        border-top: solid 1px var(--cx-color-neutral-200);
      }
    }

    cx-menu-item {
      &::part(base) {
        border-radius: var(--cx-border-radius-large);
        font-size: var(--cx-font-size-medium);
        padding: var(--cx-spacing-2x-small) var(--cx-spacing-small);
      }

      &::part(checked-icon) {
        display: none;
      }

      &::part(label) {
        font-size: var(--cx-font-size-small);
      }

      &.selected::part(base) {
        background-color: var(--cx-color-primary-50);
      }

      &.selected::part(label),
      &.selected::part(prefix),
      &.selected::part(suffix) {
        color: var(--cx-color-primary-600);
      }
    }
  }

  .browser__collections__menu {
    border: none;
    max-height: 200px;

    cx-skeleton {
      --border-radius: var(--cx-border-radius-medium);
      width: 100%;
      height: 32px;
      margin-bottom: var(--cx-spacing-3x-small);
    }
  }
`;