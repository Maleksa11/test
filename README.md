# Malek Tube

A lightweight, client-side YouTube search and player.

## Current architecture

- Static frontend; no application server, account system, or shared user database is configured.
- Watch history, playback position, cached titles, and recommendation preferences are stored in the visitor's browser storage under a versioned namespace. This browser storage is not encrypted by the app.
- The browser retains at most 60 history entries and 150 cached video titles. Clearing history also removes the app's saved title metadata and cached feed. Video files are not saved by the app; thumbnails are loaded from YouTube's image CDN.
- Searches and video metadata requests go to the public Invidious instances listed in `index.html`. Those services can observe the request and the visitor's IP address. The app does not send the complete watch-history list to them, but search terms derived from watched videos can be sent to build recommendations.
- The service worker caches only the app shell for offline opening. It does not cache search responses, video streams, watch history, or user-specific API responses.

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
- Video cards pass their own source list and video ID to the player. The YouTube embed URL uses the selected video as the first video and lists only subsequent queue items, matching YouTube's documented embed semantics. If the iframe reports a different initial video, the app corrects the queue with the documented zero-based `loadPlaylist` API.
- Tapping the video picture no longer pauses playback. The central play/pause button is the playback toggle; double-tapping the left or right side still seeks ten seconds.
- The timeline has a drag/hover preview when the metadata endpoint returns YouTube storyboard sheets; where no sheet is available, the time bubble still appears. Some videos or public API instances may not provide usable storyboard data, so thumbnail preview availability is not guaranteed for every video.
- The download shortcut opens the official YouTube watch page. It does not extract or save YouTube media files; use YouTube's own Download option when it is offered, or download your own uploaded videos through YouTube Studio.
- Picture-in-picture is best-effort and browser-dependent. The in-player PiP button is available where the browser supports it; browser-triggered and page-background attempts are also made while playback is active. The PiP play/pause state and current position are synchronized when supported. A web page cannot force PiP on every phone/browser, and background PiP may require browser permission or a native app wrapper.


## Playback startup recovery (November 20, 2026)

- The page no longer calls the Fullscreen API before the YouTube iframe is loaded. The player is already laid out to fill the app viewport; avoiding an early fullscreen request preserves the original card-click interaction for media playback.
- The iframe `onload` handler is installed before assigning its source. After load, the app retries the IFrame Player API listening handshake and `playVideo` command for a short bounded period.
- If YouTube reports that autoplay was blocked, the app shows a visible message and leaves the central Play button available. Player errors show a separate message instead of leaving an unresponsive-looking screen.
- The app script URL is versioned. The service worker shell cache was bumped and the app script/document use network-first requests, with a cached fallback for offline access. This prevents old cached JavaScript from silently replacing the deployed version during normal online use.
- A browser may still block unmuted autoplay based on its own policy. In that case the user must tap the central Play control; the site cannot override browser autoplay restrictions.
