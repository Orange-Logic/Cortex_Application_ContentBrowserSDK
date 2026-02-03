import styled from 'styled-components';

export const Container = styled.div`
  min-height: 124px;
  display: flex;
  align-items: center;
  justify-content: center;

  cx-badge::part(base) {
    width: 54px;
  }

  cx-menu {
    --cx-menu-item-background-color-hover: transparent;

    border: none;
    border-radius: 0;
    width: 100%;
  }

  cx-menu-item::part(base) {
    cursor: auto;
  }

  cx-space {
    width: auto;
  }

  cx-grid {
    width: 100%;
  }

  cx-spinner {
    --track-width: 0.2rem;
    font-size: var(--cx-font-size-3x-large);
  }

  cx-grid-item::part(base) {
    height: 100%;
  }

  .version__item__grid--center::part(base) {
    display: flex;
    align-items: center;
  }

  .version__item__number {
    display: flex;
    width: 54px;
    height: 24px;
    padding: 0px var(--cx-spacing-x-small, 8px);
    justify-content: center;
    align-items: center;
    border-radius: var(--cx-border-radius-pill);
    background: var(--cx-color-neutral-100);
  }

  .version__item__preview {
    display: flex;
    width: 100%;
    height: 88px;
    overflow: hidden;
  }

  .version__item__preview--horizontal > img {
    width: 100%;
    height: auto;
  }

  .version__item__preview--vertical > img {
    width: auto;
    height: 100%;
  }

  .version__item__preview > img,
  .version__item__preview > video {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
    border-radius: 6px;
  }

  .version__item__preview > cx-video::part(base) {
    border-radius: 6px;
  }

  .version__item__preview > cx-video {
    --video-font-size: 8px;
    --video-background-color: var(--cx-color-neutral-1000);
  }

  .version__item__name::part(base) {
    font-weight: var(--cx-font-weight-bold);
  }

  .version__item__latest {
    margin-left: var(--cx-spacing-x-small);
  }

  .version__item__latest::before {
    content: '•';
    margin-right: var(--cx-spacing-x-small);
  }

  .version__item__editor {
    color: var(--cx-color-primary);
  }
`;