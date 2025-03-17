import { CSSProperties, FC, ReactNode } from 'react';

import { MediaType } from '@/types/search';
import { getMediaIcon } from '@/utils/icon';

import { Container } from './OtherPreview.styled';

type Props = {
  children?: ReactNode;
  type?: MediaType;
  style?: CSSProperties;
};

const OtherPreview: FC<Props> = ({
  children,
  style,
  type,
}) => {

  return (
    <Container style={style}>
      <cx-icon name={getMediaIcon(type)}></cx-icon>
      {children}
    </Container>
  );
};

export default OtherPreview;