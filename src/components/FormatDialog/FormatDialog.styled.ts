import { CxDialogProps, CxDrawerProps } from '@/react-web-component';
import styled from 'styled-components';

export const Dialog = styled('cx-dialog')<CxDialogProps>`
  --body-spacing: var(--cx-spacing-small);
  --max-height: 100%;

  &::part(panel) {
    max-height: calc(var(--max-height) - var(--cx-spacing-2x-large))
  }

  &::part(body) {
    background-color: var(--cx-color-neutral-100);
    border-bottom: var(--cx-panel-border-width) solid var(--cx-panel-border-color);
    padding: 0;
  }

  &::part(footer) {
    padding: var(--cx-spacing-medium);
  }

  .dialog__menu-label {
    padding: var(--cx-spacing-x-small) var(--cx-spacing-medium);
  }

  .dialog__tracking {
    padding: var(--cx-spacing-small) var(--cx-spacing-small) var(--cx-spacing-medium) var(--cx-spacing-medium);
  }

  .dialog__footer {
    display: flex;
    justify-content: flex-end;

    cx-button-group {
      width: 100%;
    }
  }

  .dialog__footer__button {
    width: 100%;
  }

  cx-space {
    width: 100%;
  }

  cx-menu-item.selected::part(label),
  cx-menu-item.selected::part(prefix),
  cx-menu-item.selected::part(suffix) {
    color: var(--cx-color-primary);
    font-weight: var(--cx-font-weight-medium);
  }

  cx-menu-item::part(base) {
    width: var(--menu-item-width);
    max-width: 100%;
    padding: var(--cx-spacing-2x-small) var(--cx-spacing-small);
  }

  cx-menu-item::part(checked-icon) {
    display: none;
  }

  cx-line-clamp {
    word-break: break-all;
  }
`;

export const Drawer = styled('cx-drawer')<CxDrawerProps>`
  --size: 100%;

  &::part(body) {
    background-color: var(--cx-color-neutral-100);
    border-bottom: var(--cx-panel-border-width) solid var(--cx-panel-border-color);
    padding: 0;
  }

  &::part(footer) {
    padding: var(--cx-spacing-medium);
  }

  .dialog__menu-label {
    padding: var(--cx-spacing-x-small) var(--cx-spacing-medium);
  }

  .dialog__tracking {
    padding: var(--cx-spacing-small) var(--cx-spacing-small) var(--cx-spacing-medium) var(--cx-spacing-medium);
  }

  .dialog__footer {
    display: flex;
    justify-content: flex-end;

    cx-button-group {
      width: 100%;
    }
  }

  .dialog__footer__button {
    width: 100%;
  }

  cx-space {
    width: 100%;
  }

  cx-menu-item.selected::part(label),
  cx-menu-item.selected::part(prefix),
  cx-menu-item.selected::part(suffix) {
    color: var(--cx-color-primary);
    font-weight: var(--cx-font-weight-medium);
  }

  cx-menu-item::part(base) {
    width: var(--menu-item-width);
    max-width: 100%;
    padding: var(--cx-spacing-2x-small) var(--cx-spacing-small);
  }

  cx-menu-item::part(checked-icon) {
    display: none;
  }

  cx-line-clamp {
    word-break: break-all;
  }
`;