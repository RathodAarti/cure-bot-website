// Proxy adapter: route calls to HTTP (live) or Mock backend
import * as http from './http.js'
import * as mock from './mock.js'
import { ChatWS as LiveWS } from './ws.js'
import { MockWS } from './mock.js'

// MODE can be 'mock' or 'live' (VectorDB-backed server)
// Deadline-safe: hard-force mock so the app works without any backend/env.
const MODE = 'mock'

export function setBackendMode() { /* no-op while forced to mock */ }
export function getBackendMode() { return MODE }

export function createWS(opts) { return new MockWS(opts) }

export async function sendChat(payload) { return mock.sendChat(payload) }

export async function sendVoice(payload) { return mock.sendVoice(payload) }

export async function sendWhatsApp(payload) { return mock.sendWhatsApp(payload) }

export async function sendFeedback(payload) { return mock.sendFeedback(payload) }
