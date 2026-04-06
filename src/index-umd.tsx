/**
 * UMD entry: default export only so `globalThis.OrangeDAMContentBrowserSDK` stays the
 * legacy ContentBrowser API. ESM consumers use `index.tsx` (named + default exports).
 */
import ContentBrowser from './index';

export default ContentBrowser;
