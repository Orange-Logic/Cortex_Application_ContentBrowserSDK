import styled from 'styled-components';

export const Container = styled.div`
  background-color: var(--cx-color-neutral-0);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  transition: opacity ease-in 0.2s;

  .icon--large {
    font-size: var(--cx-input-font-size-large);
  }

  .search-input{
    &::part(input) {
      padding-right: var(--cx-spacing-x-small);
      padding-left: var(--cx-spacing-x-small);
    }
  }

  cx-line-clamp {
    line-height: var(--cx-line-height-small);
    &::part(content) {
      line-height: var(--cx-line-height-small);
    }
  }
`;
