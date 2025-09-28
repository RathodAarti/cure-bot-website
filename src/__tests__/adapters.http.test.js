import { sendChat, sendWhatsApp, sendFeedback } from '../adapters/http.js'

describe('HTTP adapters', () => {
  beforeEach(() => {
    global.fetch = jest.fn(async (url, opts) => {
      if (String(url).endsWith('/chat')) {
        return new Response(JSON.stringify({ text: 'ok', sources: [] }), { status: 200 })
      }
      if (String(url).endsWith('/send_whatsapp')) {
        return new Response(JSON.stringify({ ok: true }), { status: 200 })
      }
      if (String(url).endsWith('/feedback')) {
        return new Response(JSON.stringify({ ok: true }), { status: 200 })
      }
      return new Response('{}', { status: 404 })
    })
  })

  test('sendChat returns text and sources', async () => {
    const res = await sendChat({ text: 'hello' })
    expect(res.text).toBe('ok')
    expect(Array.isArray(res.sources)).toBe(true)
  })

  test('sendWhatsApp returns ok', async () => {
    const res = await sendWhatsApp({ message: 'help' })
    expect(res.ok).toBe(true)
  })

  test('sendFeedback returns ok', async () => {
    const res = await sendFeedback({ messageId: '1', value: 'up' })
    expect(res.ok).toBe(true)
  })
})
