import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .loading {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .loading__skeleton {
    --border-radius: 0;
    width: 100%;
    height: 100%;
  }

  .loading__spinner {
    --track-width: 0.2rem;
    font-size: var(--cx-font-size-3x-large);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;