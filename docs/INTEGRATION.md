# Backend Integration Guide

This document describes how the CureBot frontend calls backend APIs over HTTP and WebSocket. All user-facing text is localized via `src/i18n/index.js`.

Base URL is configured via environment variables:
- `VITE_API_BASE_URL` for HTTP (e.g., `http://localhost:8000`)
- `VITE_WS_URL` for WebSocket (e.g., `ws://localhost:8000/ws`)

## HTTP Endpoints

All requests are JSON with `Content-Type: application/json`.

### POST /chat
- Purpose: Send a user message and receive a completed AI response with citations.
- Request
```json
{
  "text": "fever home remedy"
}
```
- Response
```json
{
  "text": "Drink fluids...",
  "sources": [
    { "title": "WHO guidance", "url": "https://example.org/who", "snippet": "Drink clean water..." }
  ]
}
```
- Frontend function: `sendChat({ text })` in `src/adapters/http.js`

### POST /voice
- Purpose: Optional server-side transcription. Minimal stub in UI (Web Speech API is preferred on web). If implemented, send audio metadata or blob reference.
- Request (example)
```json
{
  "language": "en-IN"
}
```
- Response
```json
{ "text": "my transcribed speech" }
```
- Frontend function: `sendVoice(payload)`

### POST /send_whatsapp
- Purpose: Trigger a WhatsApp message to notify a clinician.
- Request
```json
{ "message": "The user needs help from a clinician." }
```
- Response
```json
{ "ok": true }
```
- Frontend function: `sendWhatsApp({ message })`

### POST /feedback
- Purpose: Capture thumbs up/down for a specific AI message id.
- Request
```json
{ "messageId": "<uuid>", "value": "up" }
```
- Response
```json
{ "ok": true }
```
- Frontend function: `sendFeedback({ messageId, value })`

## WebSocket

- URL: `VITE_WS_URL` (e.g., `ws://localhost:8000/ws`)
- Outgoing messages (example)
```json
{ "type": "chat", "text": "fever home remedy" }
```
- Incoming messages may stream tokens and then a final message:
```json
{ "type": "token", "token": "Drink " }
{ "type": "token", "token": "fluids" }
{ "type": "final", "text": "Drink fluids..." }
```
The frontend in `src/adapters/ws.js` appends `token` events to the last assistant message, and `final` completes it. If you want to include citations in streaming, send an additional message:
```json
{ "type": "sources", "sources": [{ "title": "WHO", "url": "https://example.org", "snippet": "..." }] }
```
You can extend `ChatWS` to handle `sources` accordingly.

## Error Handling
- Non-2xx HTTP status results in a generic error shown to the user via i18n `error_generic`.
- WebSocket errors are ignored silently; consider sending an error frame `{ "type": "error", "message": "..." }`.

## Performance & Size
- Keep responses concise; citations must be strict snippets provided by backend. The UI never fabricates citations.
- Bundle target is < 1MB; dependencies are minimized.
