import React, { CSSProperties, FC } from 'react';

type Props = {
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onCancel?: () => void;
};

const ConnectingBackground: FC<Props> = ({ children, footer, onCancel }) => {
  return (
    <cx-space
      direction="vertical"
      spacing="large"
      alignItems="center"
      justifyContent="center"
      style={{
        height: '100%',
        overflowY: 'auto',
        padding: 'var(--cx-spacing-2x-large)',
        textAlign: 'center',
      }}
    >
      {children}

      <cx-space direction="vertical" alignItems="center">
        <cx-spinner
          style={{
            '--indicator-color': 'var(--cx-color-neutral)',
            fontSize: 'var(--cx-font-size-2x-large)',
          } as CSSProperties}
        ></cx-spinner>
        <cx-typography variant="body3">
          Waiting to connect
        </cx-typography>
        <cx-button onClick={onCancel}>
          Cancel
        </cx-button>
      </cx-space>
      {footer}
    </cx-space>
  );
};

export default ConnectingBackground;