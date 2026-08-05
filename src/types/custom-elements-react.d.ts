import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type CxElementProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  [key: string]: unknown;
};

type CxContentBrowserLoaderProps = CxElementProps & {
  message?: string;
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'cx-content-browser': CxElementProps;
      'cx-content-browser-loader': CxContentBrowserLoaderProps;
    }
  }
}

declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'cx-content-browser': CxElementProps;
      'cx-content-browser-loader': CxContentBrowserLoaderProps;
    }
  }
}

export {};