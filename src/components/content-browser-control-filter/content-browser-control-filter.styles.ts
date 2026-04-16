import { css } from 'lit';

export default css`
  :host {
    --details-width: min(240px, 90dvw);

    display: contents;
  }

  .filter-details {
    --content-padding: 0 var(--cx-spacing-medium);

    width: var(--details-width);
  }

  .content-browser-control-filter-facet {
    --content-padding: var(--cx-spacing-x-small);
  }

  .content-browser-control-filter-facet::part(base) {
    border-top-width: 0px;
    border-right-width: 0px;
    border-left-width: 0px;
  }
`;
