import { FC } from 'react';

type Props = {
  allowFormatDialogPin: boolean;
  isLoadingPins: boolean;
  isPinned: boolean;
  onPinClick: () => void;
};

const PinButton: FC<Props> = ({
  allowFormatDialogPin,
  isLoadingPins,
  isPinned,
  onPinClick,
}) => {
  if (!allowFormatDialogPin) {
    return null;
  }

  if (isLoadingPins) {
    return (
      <cx-space
        slot="header-actions"
        align-items="center"
        justify-content="center"
        style={{
          width: '32px',
          height: '32px',
        }}
      >
        <cx-spinner></cx-spinner>
      </cx-space>
    );
  }

  return (
    <cx-tooltip
      slot="header-actions"
      content={isPinned ? 'Unpin' : 'Pin'}
      placement="bottom"
    >
      <cx-icon-button
        name="push_pin"
        variant={isPinned ? 'filled' : 'outlined'}
        style={{
          color: isPinned
            ? 'var(--cx-color-warning-400)'
            : 'var(--cx-color-text)',
        }}
        onClick={onPinClick}
      ></cx-icon-button>
    </cx-tooltip>
  );
};

export default PinButton;
