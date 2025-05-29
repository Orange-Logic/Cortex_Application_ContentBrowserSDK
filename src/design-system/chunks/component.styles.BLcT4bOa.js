import { i as t } from "./lit-element.DRlPF2me.js";
const i = t`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden],
  :not(:defined):not(video-js) {
    display: initial;
    visibility: hidden !important;
    width: 0 !important;
    height: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
  }

  @media only screen and (min-width: 640px) and (min-height: 640px) {
    ::-webkit-scrollbar {
      width: 17px;
      height: 17px;
    }

    ::-webkit-scrollbar-button:decrement {
      height: 0;
    }

    ::-webkit-scrollbar-button:increment {
      height: 0;
    }

    ::-webkit-scrollbar-button:decrement:horizontal {
      width: 0;
    }

    ::-webkit-scrollbar-button:increment:horizontal {
      width: 0;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 13px;
      background: var(--cx-color-neutral-400);
      background-clip: padding-box;
      border: 7px solid rgba(0, 0, 0, 0);
    }

    ::-webkit-scrollbar-thumb:hover {
      background: var(--cx-color-neutral-500);
      background-clip: padding-box;
      border: 4px solid rgba(0, 0, 0, 0);
    }
  }

  ::-webkit-scrollbar-thumb {
    min-height: 50px;
  }

  ::-webkit-scrollbar-button:vertical:start:increment,
  ::-webkit-scrollbar-button:vertical:end:decrement,
  ::-webkit-scrollbar-button:horizontal:start:increment,
  ::-webkit-scrollbar-button:horizontal:end:decrement {
    display: none;
  }
`;
export {
  i as c
};
