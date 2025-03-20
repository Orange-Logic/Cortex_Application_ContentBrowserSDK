import { CSSProperties, FC } from 'react';

import { MESSAGE_NEW_LINE } from '@/consts/data';

type Props = {
  message?: string;
  children?: React.ReactNode;
};

const Loader: FC<Props> = ({ message, children }) => {
  return (
    <cx-space direction="vertical" alignItems="center">
      <cx-spinner
        style={
          {
            '--track-width': '0.2rem',
            fontSize: 'var(--cx-font-size-3x-large)',
          } as CSSProperties
        }
      ></cx-spinner>
      {message?.split(MESSAGE_NEW_LINE).map((line, index) =>
        line.indexOf('http') !== -1 ? (
          <cx-button key={index} href={line} target="_blank">
            {line}
          </cx-button>
        ) : (
          <cx-typography key={index} variant="body2">
            {line}
          </cx-typography>
        ),
      )}
      {children}
    </cx-space>
  );
};

export default Loader;
