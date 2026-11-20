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
