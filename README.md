# Malek Tube

A lightweight, client-side YouTube search and player.

## Current architecture

- Static frontend; no application server, account system, or shared user database is configured.
- Watch history (up to 500 entries), playback position, cached titles, autoplay preference, and recommendation preferences are stored in the visitor's browser storage under a versioned namespace. This browser storage is not encrypted by the app.
- The browser retains at most 500 history entries and 150 cached video titles. Clearing history also removes the app's saved title metadata and cached feed. Video files are not saved by the app; thumbnails are loaded from YouTube's image CDN.
- Searches and video metadata requests go to the public Invidious instances listed in `index.html`. Those services can observe the request and the visitor's IP address. The app does not send the complete watch-history list to them, but search terms derived from watched videos can be sent to build recommendations.
- The service worker caches only the app shell for offline opening. It does not cache search responses, video streams, watch history, or user-specific API responses.
- Where supported, the app publishes Media Session metadata, lock-screen transport actions, playback position, and requests the `playback` audio-session type on Safari/WebKit.

## Privacy boundary

Data is separate between different browser profiles and devices because it is stored locally. This is **not account-level separation**: people sharing the same browser profile on the same device also share that profile's local history and interests. Adding true per-account history requires authentication and a backend database with user-scoped access rules.

## Deployment

Serve the repository over HTTPS (for example, GitHub Pages). The manifest and service worker require a secure context for installation/offline support. A service-worker update may take a browser reload to activate.

## Security notes

- No API keys, passwords, or private credentials are embedded in this static frontend.
- The page uses a restrictive Content Security Policy, a no-referrer policy, strict YouTube player message-origin checks, and text-only insertion for external titles and search suggestions.
- This is a client-side hardening pass, not a formal security audit. Review hosting response headers, dependency/supply-chain changes, and any future backend before collecting accounts or private data.


## Player update (November 2026)

- Search and For You show an animated loading indicator while additional result pages are being fetched.
- Search, For You, and history selections load the clicked video ID directly as a single-video embed. The app manages the follow-up queue itself with explicit `loadVideoById` calls, so the clicked card, actual YouTube video, timeline, and watch history stay tied to the same confirmed video ID. Original YouTube playlist URLs continue to use YouTube's native playlist player.
- The player list also loads the exact selected video ID; it no longer asks YouTube to infer the clicked position from a separate result queue.
- Watch-history cards include a per-video remove control; history expands beyond its three-item preview up to 500 locally stored entries.
- The Autoplay control is enabled by default and remembers its setting on this device. When enabled, app-managed queues advance to the next video; when disabled, the current video is replayed.
- Tapping the video picture no longer pauses playback. The central play/pause button is the playback toggle; double-tapping the left or right side still seeks ten seconds.
- The timeline has a drag/hover preview when the metadata endpoint returns YouTube storyboard sheets; where no sheet is available, the time bubble still appears. Some videos or public API instances may not provide usable storyboard data, so thumbnail preview availability is not guaranteed for every video.
- On iOS and Android phones, custom queues now try a top-level HTML5 video element using direct MP4 streams from the Invidious metadata endpoint. Unsupported streams fall back to the YouTube iframe. This gives the browser a top-frame media element for native controls and browser-initiated PiP where available; background playback remains subject to OS/browser limits. There is no visible in-player PiP button. The app tries standard and WebKit PiP paths and requests automatic PiP when the page is backgrounded. The mobile media engine supplies a top-level video element for supported streams. iOS Home Screen PWAs have a WebKit limitation where PiP can remain unavailable even when Safari supports it; web pages cannot add native iOS Background Modes or configure AVAudioSession entitlements. Guaranteed iOS background playback and PiP require a native iOS wrapper/app. Browser-initiated automatic PiP is also browser-version and permission dependent and is not guaranteed on Android.


## Playback startup recovery (November 20, 2026)

- The page no longer calls the Fullscreen API before the YouTube iframe is loaded. The player is already laid out to fill the app viewport; avoiding an early fullscreen request preserves the original card-click interaction for media playback.
- The iframe `onload` handler is installed before assigning its source. After load, the app retries the IFrame Player API listening handshake and `playVideo` command for a short bounded period.
- If YouTube reports that autoplay was blocked, the app shows a visible message and leaves the central Play button available. Player errors show a separate message instead of leaving an unresponsive-looking screen.
- The app script URL is versioned. The service worker shell cache was bumped and the app script/document use network-first requests, with a cached fallback for offline access. This prevents old cached JavaScript from silently replacing the deployed version during normal online use.
- A browser may still block unmuted autoplay based on its own policy. In that case the user must tap the central Play control; the site cannot override browser autoplay restrictions.
