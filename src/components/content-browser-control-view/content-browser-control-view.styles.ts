import { css } from 'lit';

export default css`
  :host {
    display: contents;
  }

  cx-menu[key='default-menu'] > cx-menu-item::part(checked-icon),
  cx-menu[name='main'] > cx-menu-item::part(checked-icon) {
    display: none;
  }

  .menu-item--switch {
    --submenu-icon-display: none;
    --checked-icon-display: none;
  }
`;
