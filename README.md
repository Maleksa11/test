# Malek Tube

A lightweight, client-side YouTube search and player.

## Current architecture

- Static frontend; no application server, account system, or shared user database is configured.
- Watch history (up to 500 entries), playback position, cached titles, autoplay preference, and recommendation preferences are stored in the visitor's browser storage under a versioned namespace. This browser storage is not encrypted by the app.
- The browser retains at most 500 history entries and 150 cached video titles. Clearing history also removes the app's saved title metadata and cached feed. Video files are not saved by the app; thumbnails are loaded from YouTube's image CDN.
- Searches and video metadata requests go to the public Invidious instances listed in `index.html`. Those services can observe the request and the visitor's IP address. The app does not send the complete watch-history list to them, but search terms derived from watched videos can be sent to build recommendations.
- The service worker caches only the app shell for offline opening. It does not cache search responses, video streams, watch history, or user-specific API responses.

## Privacy boundary

Data is separate between different browser profiles and devices because it is stored locally. This is **not account-level separation**: people sharing the same browser profile on the same device also share that profile's local history and interests. Adding true per-account history requires authentication and a backend database with user-scoped access rules.

## Deployment

Serve the repository over HTTPS (for example, GitHub Pages). The manifest and service worker require a secure context for installation/offline support. A service-worker update may take a browser reload to activate.

## Security and privacy review

- The current release is a static, client-side site. It has no login, application server, private API keys, or shared user database. Do not treat it as an account-based private service.
- Watch history, playback position, saved titles, and preferences are stored in browser local storage. They are not encrypted by this app and are visible to anyone who can use the same browser profile or inspect that device. Clearing the app's history removes its local history and saved title/feed data; it cannot erase logs held by external providers or YouTube account activity.
- Search phrases, autocomplete requests, video IDs, and video metadata requests are sent to public Invidious instances listed in `index.html`. The personalized home feed builds a small number of search queries from keywords in recent watched-video titles/metadata (it does not upload the full watch-history list), and those derived queries are also sent to the selected Invidious instance. Providers can receive the visitor's IP address and the query/video ID. API requests omit browser credentials and use a no-referrer policy, but the app cannot guarantee how third-party operators retain or use their logs.
- Playback is provided by the YouTube embedded player. YouTube processes the playback request under its own privacy terms and browser cookie/account settings. Malek Tube does not receive a user's Google password or YouTube login credentials.
- The page applies a restrictive Content Security Policy, a no-referrer policy, HTTPS-only allowlisted API/media origins, YouTube player message source/origin checks, video-ID validation, and text-only insertion for external titles and search suggestions. There are no third-party JavaScript libraries loaded by the page.
- The service worker caches only the app shell; it does not cache API responses, video streams, watch history, or personalized data.
- Static source review found no obvious critical client-side injection issue in the reviewed paths. This is not a penetration test or a formal security audit. GitHub Pages does not let this repository set arbitrary HTTP response headers, so headers such as `frame-ancestors`, `X-Content-Type-Options`, and a strict `Permissions-Policy` still need a hosting layer that supports custom headers. The current CSP is delivered as a meta policy; the `style-src 'unsafe-inline'` allowance remains because the app uses inline/dynamic style attributes.
- Before adding accounts, payments, uploads, or private user data, use a backend with authentication, per-user authorization rules, server-side validation, rate limits, monitoring, and a separate security review.


## Interface refresh (November 21, 2026)

- The home screen now has a focused search-first layout, with video-link playback as a secondary action, a compact topic strip, and clearer history/feed sections.
- Search results use a dedicated, quieter layout that hides home discovery elements while searching. The layout adapts from mobile to desktop and respects reduced-motion settings.
- The interface uses local CSS and system fonts; no external font or JavaScript CDN was added.

## Player update (November 2026)

- Search and For You show an animated loading indicator while additional result pages are being fetched.
- Search, For You, and history selections load the clicked video ID directly as a single-video embed. The app manages the follow-up queue itself with explicit `loadVideoById` calls, so the clicked card, actual YouTube video, timeline, and watch history stay tied to the same confirmed video ID. Original YouTube playlist URLs continue to use YouTube's native playlist player.
- The player list also loads the exact selected video ID; it no longer asks YouTube to infer the clicked position from a separate result queue.
- Watch-history cards include a per-video remove control; history expands beyond its three-item preview up to 500 locally stored entries.
- The Autoplay control is enabled by default and remembers its setting on this device. When enabled, app-managed queues advance to the next video; when disabled, the current video is replayed.
- Tapping the video picture no longer pauses playback. The central play/pause button is the playback toggle; double-tapping the left or right side still seeks ten seconds.
- The timeline has a drag/hover preview when the metadata endpoint returns YouTube storyboard sheets; where no sheet is available, the time bubble still appears. Some videos or public API instances may not provide usable storyboard data, so thumbnail preview availability is not guaranteed for every video.
- Background and browser-triggered picture-in-picture remain best-effort and browser-dependent. There is no visible in-player PiP button. A web page cannot force PiP on every phone/browser, and background PiP may require browser permission or a native app wrapper.


## Playback startup recovery (November 20, 2026)

- The page no longer calls the Fullscreen API before the YouTube iframe is loaded. The player is already laid out to fill the app viewport; avoiding an early fullscreen request preserves the original card-click interaction for media playback.
- The iframe `onload` handler is installed before assigning its source. After load, the app retries the IFrame Player API listening handshake and `playVideo` command for a short bounded period.
- If YouTube reports that autoplay was blocked, the app shows a visible message and leaves the central Play button available. Player errors show a separate message instead of leaving an unresponsive-looking screen.
- The app script URL is versioned. The service worker shell cache was bumped and the app script/document use network-first requests, with a cached fallback for offline access. This prevents old cached JavaScript from silently replacing the deployed version during normal online use.
- A browser may still block unmuted autoplay based on its own policy. In that case the user must tap the central Play control; the site cannot override browser autoplay restrictions.
