export class ChatWS {
  constructor({ url = (import.meta.env.VITE_WS_URL || ''), onMessage } = {}) {
    this.url = url || (location.origin.replace('http', 'ws') + '/ws')
    this.onMessage = onMessage
    this.ws = null
  }
  connect() {
    this.ws = new WebSocket(this.url)
    this.ws.onopen = () => {}
    this.ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        if (data.type === 'token') this.onMessage?.(data.token)
        if (data.type === 'final') this.onMessage?.(data.text)
      } catch {
        this.onMessage?.(String(e.data))
      }
    }
    this.ws.onclose = () => {}
    this.ws.onerror = () => {}
  }
  isOpen() { return this.ws && this.ws.readyState === WebSocket.OPEN }
  send(obj) { if (this.isOpen()) this.ws.send(JSON.stringify(obj)) }
  close() { try { this.ws?.close() } catch {} }
}
