# CureBot Frontend (React + Vite)

A lightweight, accessible chat UI optimized for low-literacy rural users. Provides text and voice input, source citations, a clear "call a clinician" flow, and per-response feedback. Channel-agnostic adapters support HTTP and WebSocket backends.

## Quick Start

1. Install dependencies
```bash
npm install
```

2. (Optional) Install Playwright browser
```bash
npx playwright install chromium
```

3. Run dev server
```bash
npm run dev
```

4. Run unit tests (Jest)
```bash
npm test
```

5. Run e2e tests (Playwright)
```bash
npm run dev &  # start server
npm run e2e
```

## Environment
Copy `.env.example` to `.env` and set values as needed.

- `VITE_API_BASE_URL` e.g. `http://localhost:8000`
- `VITE_WS_URL` e.g. `ws://localhost:8000/ws`

## Directory Structure
- `src/components/ChatBox.jsx` main chat UI
- `src/components/VoiceButton.jsx` voice input with Web Speech API fallback
- `src/components/SourcePanel.jsx` strict snippet citations
- `src/components/Feedback.jsx` thumbs up/down -> `/feedback`
- `src/adapters/http.js` HTTP calls: `/chat`, `/voice`, `/send_whatsapp`, `/feedback`
- `src/adapters/ws.js` WebSocket streaming adapter
- `src/i18n/index.js` i18n resources (English + Hindi)
- `tests/e2e.spec.ts` Playwright E2E
- `src/__tests__/` Jest unit tests

## Accessibility & UX
- Semantic HTML, ARIA labels, large touch targets, high legibility
- Live region updates for responses, visible focus rings
- Language toggle (English/Hindi), channel toggle (HTTP/WS)

## Docs
- See `docs/INTEGRATION.md` for backend API contracts and sample payloads
- See `docs/UX_SPEC.md` for UX and content guidelines
