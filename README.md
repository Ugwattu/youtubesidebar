# YouTube Sidebar

YouTube Sidebar is a Chrome extension designed to simplify and enhance the YouTube user interface. It reorganizes page elements—such as comments, video descriptions, related videos, and playlists—into a clean, tabbed sidebar, allowing for a more focused viewing experience.

## Features

### 1. Tabbed Sidebar Layout
The extension moves the following sections into a dedicated sidebar on the right side of the video player:
*   **Meta**: Video metadata and expanded info.
*   **Comments**: View and interact with comments without scrolling down.
*   **Related**: Quick access to recommended videos.
*   **List**: Access your current playlist.
*   **Chat**: Integrated live chat container.

### 2. Advanced Video Looper
Includes a custom A-B loop functionality directly integrated into the YouTube player:
*   **Auto-Loop Button**: A dedicated button in the player controls to toggle looping.
*   **Visual Selectors**: Drag-and-drop handles on the progress bar to define specific start and end points for your loop.

### 3. Customizable Settings
Accessible via the extension popup or the on-page settings UI:
*   **Sidebar Width**: Choose between Default, Extra Wide, or "Super Extra Wide" (XXL) to fit your screen.
*   **Default Tab**: Set which tab (Meta, Comments, Related, or List) opens by default.
*   **Button Styles**: Toggle between a Google-inspired style or a simplified theme.

## Installation Chrome

1.  Clone or download this repository.
2.  Open Chrome and navigate to `chrome://extensions/`.
3.  Enable **Developer mode** in the top right corner.
4.  Click **Load unpacked** and select the project folder.

## Installation Firefox

1.  Clone or download this repository.
2.  Open Chrome and navigate to `addons.mozilla.org/`.
3.  Enable **Developer mode** in the top right corner.
4.  Click **Load unpacked** and select the project folder.

## Technical Overview

*   **Manifest V3**: Built using the latest Chrome Extension standards.
*   **Content Scripts**: `chrome.js` handles the DOM manipulation and layout reorganization.
*   **Background Service**: `background.js` manages tab states and extension actions.
*   **UI**: Uses jQuery 3.3.1 for DOM interaction and custom CSS (`youtubestyle.css`) for layout adjustments.# YouTube-SideBar
