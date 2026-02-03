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
      align-items="center"
      justify-content="center"
      block
      style={{
        containerType: 'inline-size',
        containerName: 'connecting-background',
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        padding: 'var(--cx-spacing-2x-large)',
        textAlign: 'center',
      }}
    >
      {children}

      <div>
        <cx-space direction="vertical" align-items="center">
          <cx-spinner
            style={
              {
                '--track-width': '0.2rem',
                fontSize: 'var(--cx-font-size-3x-large)',
              } as CSSProperties
            }
          ></cx-spinner>
          <cx-typography variant="body3">Waiting to connect</cx-typography>
          <cx-button onClick={onCancel}>Cancel</cx-button>
        </cx-space>
      </div>

      {footer}
    </cx-space>
  );
};

export default ConnectingBackground;
