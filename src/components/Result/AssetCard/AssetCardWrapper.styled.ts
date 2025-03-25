import styled from 'styled-components';

export const Container = styled.div`
  .wrapper__progress-bar {
    --height: 4px;
  }

  .wrapper__content {
    box-sizing: border-box;
    overflow: auto;
    padding: var(--cx-spacing-2x-small) 0;
  }

  .wrapper__content__empty {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;

    cx-spinner {
      --track-width: 6px,
      font-size: var(--cx-font-size-3x-large),
    }
  }

  .asset-card__masonry > div {
    align-items: center;
  }
`;