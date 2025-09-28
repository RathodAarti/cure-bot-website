# CureBot UX Spec

This UX spec aims to support low-literacy rural users. The design prioritizes clarity, legibility, and minimal cognitive load.

## Principles
- Plain language, avoid jargon
- Large, tappable controls (44x44px min)
- High-contrast buttons and focus styles
- Progressive disclosure: show essentials first
- Respect bandwidth and device constraints

## Layout
- Header: app title, language switcher, connection switcher (HTTP/WebSocket)
- Main: chat transcript
  - Messages: user (right, subtle background), assistant (left, white card)
  - Assistant message extras:
    - Source citations: show strict snippets and links when provided
    - Feedback: thumbs up/down buttons
    - Call a clinician button: prominent, green
- Footer: short disclaimer

## Interaction
- Text input with clear placeholder: "Type your question in simple words..."
- Voice input button toggles recording (Web Speech API). When unsupported, backend `POST /voice` fallback can be wired.
- Sending a message:
  - Append user bubble
  - If HTTP channel: show assistant message on response
  - If WS channel: stream tokens into a single assistant bubble
- Citations are only what backend provides, no hallucinated links
- Feedback sends `{ messageId, value }` to `/feedback` and shows a small confirmation
- Call clinician triggers `/send_whatsapp` and shows a confirmation/failure toast (simple `alert` in MVP)

## Accessibility
- Semantic elements with ARIA attributes
- Live region for transcript updates (`aria-live="polite"`)
- Buttons with `aria-label`s
- Focus-visible rings and keyboard operability throughout

## Localization
- All UI text is in `src/i18n/index.js` (English + Hindi seed). Avoid hardcoded strings in components.

## Performance
- Minimal dependencies
- No large UI libraries
- Tailwind utility CSS with tiny config

## Empty and Error States
- Initial assistant wave emoji as a friendly starter
- Generic error message via i18n on failures

## Future Enhancements
- Offline caching of recent answers
- Audio recording UI and upload for server transcription
- Rich message types (images, forms) with size constraints
