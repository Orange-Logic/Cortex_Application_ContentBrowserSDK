import styled from 'styled-components';

import { CxSpaceProps } from '@/react-web-component';

export const Container = styled('cx-space')<CxSpaceProps & { bordered?: boolean }>`
  border-bottom: ${({ bordered }) => (bordered ? '1px solid var(--cx-color-neutral-300)' : 'none')};
  padding: var(--cx-spacing-medium);

  cx-avatar {
    --size: var(--cx-font-size-3x-large);

    cursor: pointer;
  }

  cx-skeleton {
    --color: var(--cx-color-primary);

    width: var(--cx-font-size-3x-large);
    height: var(--cx-font-size-3x-large);
  }

  cx-menu-item::part(checked-icon) {
    display: none;
  }

  .header {
    flex-wrap: nowrap;
    width: 100%;
  }

  .header__title {
    display: flex;
    align-items: center;
  }

  .header__menu {
    display: flex;
    gap: var(--cx-spacing-2x-small);
    align-items: center;
    width: fit-content;
  }

  .header__user-info:hover::part(base) {
    background-color: unset;
    cursor: default;
  }

  .header__user-info cx-avatar {
    cursor: default;
  }
`;