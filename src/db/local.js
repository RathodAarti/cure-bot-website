// Simple local "database" using localStorage to persist messages, feedback, and logs
// This is a dummy stand-in for Vector DB / Knowledge Store for frontend prototyping.

const KEY = 'curebot_local_db_v1'

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : { messages: [], feedback: [], logs: [] }
  } catch {
    return { messages: [], feedback: [], logs: [] }
  }
}

function write(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)) } catch {}
}

export function saveMessage(msg) {
  const db = read()
  db.messages.push({ ...msg, ts: Date.now() })
  write(db)
}

export function listMessages(limit = 50) {
  const db = read()
  const list = db.messages.slice(-limit)
  return list
}

export function saveFeedback(entry) {
  const db = read()
  db.feedback.push({ ...entry, ts: Date.now() })
  write(db)
}

export function log(event, meta = {}) {
  const db = read()
  db.logs.push({ event, meta, ts: Date.now() })
  write(db)
}
