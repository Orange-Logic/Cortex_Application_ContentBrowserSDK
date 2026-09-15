# Introduction 
Orange Logic’s OrangeDAM Content Browser SDK allows authenticated users to browse Orange Logic assets in external web applications. You can use this tool to develop custom integrations between your Orange Logic platform and other software your organization uses.

For example, let’s say your organization’s creative team stores images in Orange Logic. However, the marketing team uses a Content Management System (CMS) to build webpages. You can add the OrangeDAM Content Browser SDK to your CMS so users can search, filter, and select assets directly from Orange Logic, and then use them in your CMS.

# Getting Started

##	Installation process

### Environment Setup
1. Copy the environment template:

   **Unix/macOS:**
   ```bash
   cp .env.example .env.local
   ```

   **Windows Command Prompt:**
   ```cmd
   copy .env.example .env.local
   ```

   **Windows PowerShell:**
   ```powershell
   Copy-Item .env.example .env.local
   ```

2. Install dependencies (this will load the environment variables automatically):

   **Unix/macOS:**
   ```bash
   yarn install
   ```

##	Software dependencies
NodeJS v18 or higher

##	Latest releases
Content Browser SDK v2.1.0

# Build and Test
- Run the project with 
```
yarn start
```

- Build with 
```
yarn build
```
- use the 2 files `build/OrangeDAMContentBrowserSDK.min.js` and `build/OrangeDAMContentBrowserSDK.min.css` in your other projects

# More guide
For detail guides on usage check out the [Orange Logic Developer Portal](https://developer.orangelogic.com/docs/generic-asset-browser)

## Reuse the Current Cortex Login

For an HTML page served by the Cortex site, enable `useSiteSession` to use the
browser's existing site login. No site URL, token callback, or SDK login is needed.
Load `build/OrangeDAMContentBrowserSDK.min.js` and
`build/OrangeDAMContentBrowserSDK.min.css`, then open the picker with:

```html
<div id="asset-picker" style="height: 600px"></div>
<script>
  OrangeDAMContentBrowser.open({
    containerId: 'asset-picker',
    useSiteSession: true,
    onAssetSelected: (assets) => console.log(assets),
  });
</script>
```

The site defaults to `window.location.origin`. For a Cortex installation under a
virtual directory, supply a `baseUrl` on that same origin. The HTML page (or iframe
document) must run on the Cortex origin; loading the SDK script from Cortex into a
page on another domain does not share its login.

This mode uses cookies managed by the browser and ignores saved SDK credentials,
`onRequestToken`, and `useSession`. It hides SDK logout and does not launch SDK
authentication when the site session expires. Sign in through the Cortex site and
reopen the picker to resume. Omit `useSiteSession` to retain the existing SDK
authentication flow.

# Change Log
* March 24, 2026 - v2.2.3
  * Supports displaying asset thumbnails according to the selected format (https://link.orangelogic.com/Tasks/420YSB)
* Dec 19, 2025 - v2.2.1
  * Fix various bugs and issues from v2.2.0
  * Various improvements in UI/UX
  * Assets in cold storage are now visually disabled and prevented from being selected, with a clear message displayed to users.
  * Enhanced asset preview component to support custom icon display.
  * Avatar URL handling updated to correctly detect and preserve fully-qualified (http/https) avatar links while continuing to prefix relative avatar paths with the site's base URL.
  * Updated design system dependency to the latest version
  * Enhanced view menu item alignment in the control bar for better positioning
* Nov 10, 2025 - v2.2.0
  * Better multimedia support (video/story/widget)
  * Highlighted search terms
  * Persistent/overlay sidebar
  * Refined asset previews/cards
  * Copy-to-clipboard for auth URL
  * Token change/connect hooks
  * Asset version history with previews
  * Favorites (favorite/unfavorite)
  * Load-more pagination
  * Custom rendition controls (quality, preserve metadata)
  * Asset selection
  * Various improvements in search, filtering, and UI/UX
* Apr 8, 2025 - v2.1.0
  * Rename GAB to Content Browser SDK
  * Revamp the Content Browser SDK's entire UI
  * Add a new demo page with more explanations on the invoke function's properties
  * Content Browser SDK now allows you to pick all asset file extensions
  * Add on-the-fly image transformation functionality
  * Add tracking link capabilities
  * More control on the Content Browser's invoke parameters level and Orange DAM administrative level
* Dec 20, 2024 - v1.2.2
  * Change Orange DAM to OrangeDAM
  * GAB in demo will not pre populate with "https://cortexdemo2.orangelogic.com/" any more
* Nov 08, 2024 - v1.2.1
  * Resolve CSS conflict with AEM (https://link.orangelogic.com/Tasks/28L9P3)
* Jul 09, 2024 - v1.2.0
  * Handle encrypted asset thumbnails (https://link.orangelogic.com/Tasks/4152M3)
* May 29, 2024 - v1.1.0
  * Add the ability to select a proxy in the GAB UI
  * Handle authentication when reopening the GAB
