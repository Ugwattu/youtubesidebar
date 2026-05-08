<p align="center"><a href="Add link" target="_blank" rel="noreferrer noopener"><img width="250" alt="youTube-SideBar" src="https://raw.githubusercontent.com/Ugwattu/youtubesidebar/refs/heads/main/images/youtubesidebar.png"></a></p>
<p align="center">Youtube Sidebar is an extension designed to <strong>simplify and enhance the Youtube user interface.</strong></p>
<br/>
<p align="center"><a rel="noreferrer noopener" href="Add Link"><img alt="Chrome Web Store" src="https://img.shields.io/badge/Chrome-141e24.svg?&style=for-the-badge&logo=google-chrome&logoColor=white"></a>  <a rel="noreferrer noopener" href="https://addons.mozilla.org/firefox/addon/youtubesidebar/"><img alt="Firefox Add-ons" src="https://img.shields.io/badge/Firefox-141e24.svg?&style=for-the-badge&logo=firefox-browser&logoColor=white"></a>

<h2 align="center">Youtube Sidebar</h2>
<br/>
<p align="center">YouTube Sidebar is a extension designed to <strong>simplify and enhance the YouTube user interface</strong>. It reorganizes page elements—such as <strong>comments, video descriptions, related videos, and playlists</strong>—into a clean, <strong>tabbed sidebar</strong>, allowing for a more focused viewing experience</p>
<br/>

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
*   **Default Tab**: Set which tab (Meta, Comments, Related, or List) opens by default.
*   **Button Styles**: Toggle between a Google-inspired style or a simplified theme.

## Technical Overview

*   **Manifest V3**: Built using the latest Chrome Extension standards.
*   **Content Scripts**: `chrome.js` handles the DOM manipulation and layout reorganization.
*   **Background Service**: `background.js` manages tab states and extension actions.
*   **UI**: Uses jQuery 3.3.1 for DOM interaction and custom CSS (`youtubestyle.css`) for layout adjustments.# YouTube-SideBar
