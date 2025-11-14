import { forwardRef, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import type { CxLineClamp } from '@orangelogic-private/design-system';
import type { CxLineClampProps } from '@orangelogic-private/design-system/react-types';
import mergeRefs from '@/utils/mergeRefs';

const StyledCxLineClamp = styled('cx-line-clamp')<CxLineClampProps>`
  --max-width: min(80vw, 350px);
`;

const elementName = 'cx-line-clamp';

const LineClamp = forwardRef<CxLineClamp, CxLineClampProps>(
  (props: CxLineClampProps, ref) => {
    const {
      children,
      content,
      ...otherProps
    } = props;

    const lineClampRef = useRef<CxLineClamp>(null);
    const [isDefined, setIsDefined] = useState(false);

    useEffect(() => {
      customElements.whenDefined(elementName).then(() => {
        setIsDefined(true);
      });
    }, []);

    useEffect(() => {
      const lineClamp = lineClampRef.current;
      if (!lineClamp) return;
      const container = lineClampRef.current?.closest('.cbsdk__home');
      if (!container) return;
      lineClamp.flipBoundary = container;
      lineClamp.shiftBoundary = container;
    }, [isDefined]);


    return (
      <StyledCxLineClamp
        ref={mergeRefs(ref, lineClampRef)}
        content={content}
        {...otherProps}
      >
        {children}
      </StyledCxLineClamp>
    );
  },
);

LineClamp.displayName = 'LineClamp';

export default LineClamp;
