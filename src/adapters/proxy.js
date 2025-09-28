// Proxy adapter: route calls to HTTP (live) or Mock backend
import * as http from './http.js'
import * as mock from './mock.js'
import { ChatWS as LiveWS } from './ws.js'
import { MockWS } from './mock.js'

// MODE can be 'mock' or 'live' (VectorDB-backed server)
let MODE = (import.meta.env.VITE_BACKEND_MODE || 'mock').toLowerCase() === 'live' ? 'live' : 'mock'

export function setBackendMode(mode) {
  MODE = (String(mode || '').toLowerCase() === 'live') ? 'live' : 'mock'
}
export function getBackendMode() { return MODE }

export function createWS(opts) {
  return MODE === 'live' ? new LiveWS(opts) : new MockWS(opts)
}

export async function sendChat(payload) {
  return MODE === 'live' ? http.sendChat(payload) : mock.sendChat(payload)
}

export async function sendVoice(payload) {
  return MODE === 'live' ? http.sendVoice(payload) : mock.sendVoice(payload)
}

export async function sendWhatsApp(payload) {
  return MODE === 'live' ? http.sendWhatsApp(payload) : mock.sendWhatsApp(payload)
}

export async function sendFeedback(payload) {
  return MODE === 'live' ? http.sendFeedback(payload) : mock.sendFeedback(payload)
}
