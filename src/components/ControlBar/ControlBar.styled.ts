import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  gap: var(--cx-spacing-small);
  width: 100%;

  --menu-item-width: 278px;
  --details-width: 354px;

  cx-input {
    width: 40vw;
    max-width: 300px;
    max-width: 100%;
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

  .filter-details {
    width: var(--details-width);
    max-width: 100%;

    cx-space {
      flex-wrap: wrap;
    }

    cx-tree {
      width: 100%;
    }

    cx-tree-item {
      &::part(item) {
        padding: var(--cx-spacing-2x-small) 0;
      }

      &::part(item--selected) {
        background-color: transparent;
      }
    }
  }

  .filter-details--empty {
    &::part(content) {
      padding: 0;
    }
  }

  .menu-item--switch {
    &::part(label) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    &::part(submenu-icon) {
      display: none;
    }
  }
`;

export const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--cx-spacing-2x-small);
`;