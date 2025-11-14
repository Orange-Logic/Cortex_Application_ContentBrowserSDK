import React, {
  FC,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type CxResizeObserver from '@orangelogic-private/design-system/components/resize-observer';
import { Container } from './ArrayClamp.styled';
import LineClamp from '../LineClamp';

type ArrayClampProps = {
  children: React.ReactNode;
  className?: string;
  separator?: string;
  tooltipSeparator?: string;
  getChildString?: (index: number) => string;
};
type ArrayChildrenProps = {
  children: React.ReactNode;
  isClamped: (index: number) => boolean | undefined;
  separator?: string;
  totalVisible: number;
};

const ArrayChildren: FC<ArrayChildrenProps> = ({
  children,
  isClamped,
  separator,
  totalVisible,
}) => {
  const renderLastItem = (child: React.ReactNode, index: number) => {
    return (
      <LineClamp
        class={`array-clamp__item ${isClamped(index) ? 'clamped' : ''}`}
      >
        {child}
      </LineClamp>
    );
  };

  const renderItem = (child: React.ReactNode, index: number) => {
    if (index === totalVisible - 1) {
      return renderLastItem(child, index);
    }

    return (
      <span
        className={`array-clamp__item ${isClamped(index) ? 'clamped' : ''}`}
      >
        {child}
        <span className="array-clamp__separator">{separator}</span>
      </span>
    );
  };

  return React.Children.map(children, (child, index) =>
    renderItem(child, index),
  );
};

const ArrayClamp: FC<ArrayClampProps> = ({ children, className, separator = ', ', tooltipSeparator, getChildString }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<CxResizeObserver>(null);
  const [clampedMap, setClampedMap] = useState(new Map<number, boolean>());

  const totalClamped = Array.from(clampedMap.values()).filter(Boolean).length;
  const totalVisible = React.Children.count(children) - totalClamped;

  const hiddenChildrenStr = useMemo(() => {
    return React.Children.toArray(children)
      .map((child, index) => {
        if (!clampedMap.get(index)) {
          return '';
        }
        if (getChildString) {
          return getChildString(index);
        }
        if (typeof child === 'string') {
          return child;
        } else if (isValidElement(child)) {
          return (child.props as { children: string }).children;
        } else {
          return '';
        }
      })
      .filter(Boolean)
      .join(tooltipSeparator || separator);
  }, [children, clampedMap, tooltipSeparator, separator, getChildString]);

  useEffect(() => {
    const container = containerRef.current;
    const resizeObserver = resizeObserverRef.current;

    if (!container || !resizeObserver) {
      return;
    }

    const handleResize = () => {
      const items = container.querySelectorAll('.array-clamp__item');
      const containerWidth = container.clientWidth;
      let currentWidth = 0;
      let hasClamped = false;

      items.forEach((item, index) => {
        if (hasClamped) {
          setClampedMap((prev) => new Map(prev.set(index, true)));
        } else {
          currentWidth += item.clientWidth;

          if (currentWidth > containerWidth) {
            hasClamped = true;
            setClampedMap((prev) => new Map(prev.set(index, true)));
          }
        }
      });
    };

    const onResize = (e: CustomEvent) => {
      if (e.target !== resizeObserver) {
        return;
      }
      handleResize();
    };

    resizeObserver.addEventListener('cx-resize', onResize);
    handleResize();

    return () => {
      resizeObserver.removeEventListener('cx-resize', onResize);
    };
  }, [children]);

  const isClamped = useCallback(
    (index: number) => {
      return clampedMap.get(index);
    },
    [clampedMap],
  );

  return (
    <Container className={`array-clamp ${className}`}>
      <cx-resize-observer ref={resizeObserverRef}>
        <div ref={containerRef} className={'array-clamp__items-container'}>
          <ArrayChildren
            isClamped={isClamped}
            separator={separator}
            totalVisible={totalVisible}
          >
            {children}
          </ArrayChildren>
        </div>
        {totalClamped > 0 && (
          <cx-tag variant="neutral" size="small" pill class="array-clamp__indicator">
            <LineClamp tooltip={hiddenChildrenStr} lines={1}>
              +{totalClamped}
            </LineClamp>
          </cx-tag>
        )}
      </cx-resize-observer>
    </Container>
  );
};

export default ArrayClamp;
