import { FC } from 'react';

type Props = {
  icon: string;
  message: string;
};

const NoResult: FC<Props> = ({
  icon,
  message,
}: Props) => {
  return (
    <div
      data-testid="no-results"
      style={{
        alignItems: 'center',
        color: 'var(--cx-color-neutral)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--cx-spacing-medium)',
        height: '100%',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
      }}
    >
      <cx-icon
        name={icon}
        style={{
          fontSize: '96px',
        }}
      ></cx-icon>
      {message}
    </div>
  );
};

export default NoResult;