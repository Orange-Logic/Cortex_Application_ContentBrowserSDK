import styled from 'styled-components';

export const Container = styled.div`
  align-items: center;
  display: flex;
  gap: var(--cx-spacing-2x-small);
  text-overflow: ellipsis;
  overflow: hidden;

  .array-clamp__items-container{
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    flex-grow: 1;
    flex-shrink: 1;
    overflow: hidden;
  }

  .array-clamp__item {
    white-space: nowrap;
  }

  .array-clamp__separator {
    white-space: pre;
  }

  .array-clamp__item.clamped {
    display: none;
  }

  .array-clamp__indicator {
    flex-shrink: 0;
  }

  .array-clamp__indicator::part(base) {
    max-width: 4rem;
    display: flex;
    overflow-wrap: break-word;
    padding: 0 0.6em;
    line-height: 0;
  }
`;