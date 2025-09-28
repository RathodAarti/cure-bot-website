const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

async function http(path, { method = 'POST', body, headers = {} } = {}) {
  const res = await fetch(API_BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error('Network error')
  return res.json()
}

export async function sendChat({ text }) {
  return http('/chat', { body: { text } })
}

export async function sendVoice(payload) {
  return http('/voice', { body: payload })
}

export async function sendWhatsApp({ message }) {
  return http('/send_whatsapp', { body: { message } })
}

export async function sendFeedback({ messageId, value }) {
  return http('/feedback', { body: { messageId, value } })
}
