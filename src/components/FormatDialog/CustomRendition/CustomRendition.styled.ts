import styled from 'styled-components';

export const Container = styled.div`
  .details__summary__icon {
    width: var(--cx-font-size-3x-large);
    height: var(--cx-font-size-3x-large);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--cx-color-neutral-100);
    border-radius: var(--cx-border-radius-large);
    color: var(--cx-color-neutral-600);
    font-size: var(--cx-font-size-large);
  }

  .details__summary__input-label {
    color: var(--cx-color-neutral-400);
    margin-inline-start: var(--cx-spacing-small);
  }

  cx-input::part(input) {
    padding-left: var(--cx-spacing-small);
    padding-right: var(--cx-spacing-small);
  }

  cx-space {
    width: 100%;

    cx-input {
      flex: 1;
    }
  }

  cx-select {
    width: 120px;
  }

  .resize__input-group {
    display: flex;
    flex: 1;
  }

  .extension {
    padding: var(--cx-spacing-small) var(--cx-spacing-medium);
    border: solid 1px var(--cx-color-neutral-200);
    background-color: var(--cx-color-neutral-0);

    cx-select{
      flex: 1;
      width: 100%;
    }
  }

  cx-details:not(:last-child)::part(base) {
    border-bottom-width: 0;
  }
`;