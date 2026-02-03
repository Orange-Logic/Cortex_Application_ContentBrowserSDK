import type { CxMenuProps } from '@orangelogic/design-system/react-types';
import styled from 'styled-components';

export const Container = styled('cx-menu')<CxMenuProps>`
  border: none;
  border-radius: 0;
  padding: 0;
  
  cx-menu-item {
    border-bottom: var(--cx-panel-border-width) solid var(--cx-panel-border-color);

    &::part(base) {
      height: 60px;
      padding: var(--cx-spacing-x-small) var(--cx-spacing-medium);
    }

    &::part(label) {
      display: flex;
      align-items: center;
    }

    &::part(checked-icon) {
      display: none;
    }

    &::part(submenu-icon) {
      display: none;
    }

    &::part(suffix) {
      color: var(--cx-color-neutral-600);
    }

    .icon--primary {
      color: var(--cx-color-primary);
    }

    &.proxy--switch::part(label) {
      justify-content: space-between;
    }

    .proxy__name {
      color: var(--cx-color-neutral-900);
      
      &::part(base) {
        font-weight: var(--cx-font-weight-medium);
      }
    }

    .proxy__name.selected {
      --color: var(--cx-color-primary);
    }

    .proxy__thumbnail {
      background-color: var(--cx-color-neutral-100);
      width: 54px;
      height: 40px;
      object-fit: cover;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: auto;
        max-width: 100%;
        max-height: 100%;
      }
    }

    .proxy__details {
      --color: var(--cx-color-neutral-500);
      &::part(base) {
        display: flex;
        align-items: center;
        gap: var(--cx-spacing-2x-small);
      }
    }

    .proxy__extension-dot {
      display: inline-block;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background-color: var(--cx-color-neutral-500);
    }
  }
`;
