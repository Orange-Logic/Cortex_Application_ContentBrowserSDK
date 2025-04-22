# Introduction 
Orange Logic’s OrangeDAM Content Browser SDK allows authenticated users to browse Orange Logic assets in external web applications. You can use this tool to develop custom integrations between your Orange Logic platform and other software your organization uses.

For example, let’s say your organization’s creative team stores images in Orange Logic. However, the marketing team uses a Content Management System (CMS) to build webpages. You can add the OrangeDAM Content Browser SDK to your CMS so users can search, filter, and select assets directly from Orange Logic, and then use them in your CMS.

# Getting Started

##	Installation process
Install dependencies with 
```
npm install
``` 
or 
```
yarn
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
- use the 2 files `build\static\js\ContentBrowserSDK.min.js` and `build\static\css\ContentBrowserSDK.min.css` in your other projects

# More guide
For detail guides on usage check out the [Orange Logic Developer Portal](https://developer.orangelogic.com/docs/generic-asset-browser)

# Change Log
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
