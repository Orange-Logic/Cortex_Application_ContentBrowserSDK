export const popoverSupported =
  CSS.supports('(overlay: auto)') &&
  'showPopover' in document.createElement('div');