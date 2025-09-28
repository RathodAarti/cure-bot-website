// Proxy adapter: route calls to HTTP (live) or Mock backend
import * as http from './http.js'
import * as mock from './mock.js'
import { ChatWS as LiveWS } from './ws.js'
import { MockWS } from './mock.js'

// Force MOCK mode only
let MODE = 'mock' // 'mock' only

// Keep API, but lock to mock. Any call will remain mock.
export function setBackendMode() { MODE = 'mock' }
export function getBackendMode() { return 'mock' }

export function createWS(opts) { return new MockWS(opts) }

export async function sendChat(payload) { return mock.sendChat(payload) }

export async function sendVoice(payload) { return mock.sendVoice(payload) }

export async function sendWhatsApp(payload) { return mock.sendWhatsApp(payload) }

export async function sendFeedback(payload) { return mock.sendFeedback(payload) }
