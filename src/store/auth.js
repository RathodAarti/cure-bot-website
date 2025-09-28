// Minimal auth store using localStorage (demo only)
const KEY = 'curebot_auth_v1'
const USERS_KEY = 'curebot_users_v1'

function emit(user) {
  try { window.dispatchEvent(new CustomEvent('curebot:auth', { detail: { user } })) } catch {}
}

function read() {
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null } catch { return null }
}
function write(v) {
  try { localStorage.setItem(KEY, JSON.stringify(v)); emit(v) } catch {}
}

export function getUser() { return read() }
export function isLoggedIn() { return !!read() }
export function login(payload) {
  const user = { role: 'user', ...payload, ts: Date.now() }
  write(user)
  return getUser()
}
export function logout() { try { localStorage.removeItem(KEY); emit(null) } catch {} }
export function updateUser(patch) { const u = read() || {}; const n = { ...u, ...patch }; write(n); return getUser() }
export function guestLogin() { return login({ name: 'Guest', role: 'guest' }) }
export function deleteAccount() { logout() }

// User database helpers
function readUsers() {
  try { const raw = localStorage.getItem(USERS_KEY); return raw ? JSON.parse(raw) : [] } catch { return [] }
}
function writeUsers(list) {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(list)) } catch {}
}
function findByEmail(email) { if (!email) return null; return readUsers().find(u => (u.email||'').toLowerCase() === String(email).toLowerCase()) || null }
function findByPhone(phone) { if (!phone) return null; return readUsers().find(u => (u.phone||'') === String(phone)) || null }

// Register a new user with unique email/phone
export function register({ name, email, phone, password }) {
  const users = readUsers()
  const existsByEmail = email ? users.some(u => (u.email||'').toLowerCase() === String(email).toLowerCase()) : false
  const existsByPhone = phone ? users.some(u => (u.phone||'') === String(phone)) : false
  if (existsByEmail || existsByPhone) {
    const field = existsByEmail ? 'email' : 'phone'
    const err = new Error(`An account already exists with that ${field}.`)
    err.code = 'DUPLICATE_USER'
    throw err
  }
  const id = crypto?.randomUUID ? crypto.randomUUID() : String(Date.now())
  const newUser = { id, role: 'user', name: name || 'You', email: email || undefined, phone: phone || undefined, password: String(password||'') }
  users.push(newUser)
  writeUsers(users)
  // Also set as current session user (without exposing password)
  const { password: _pw, ...sessionUser } = newUser
  write({ ...sessionUser, ts: Date.now() })
  return getUser()
}

// Recover password (demo only). In real apps, never send/store plaintext passwords.
export function recoverPassword({ email, phone }) {
  const users = readUsers()
  const candidate = email ? users.find(u => (u.email||'').toLowerCase() === String(email).toLowerCase()) : users.find(u => (u.phone||'') === String(phone))
  if (!candidate) {
    const err = new Error('No account found for the provided contact.')
    err.code = 'NO_ACCOUNT'
    throw err
  }
  return String(candidate.password || '')
}

// Login with password using email or phone
export function loginWithPassword({ email, phone, password }) {
  const users = readUsers()
  const candidate = email ? users.find(u => (u.email||'').toLowerCase() === String(email).toLowerCase()) : users.find(u => (u.phone||'') === String(phone))
  if (!candidate) {
    const err = new Error('No account found for the provided credentials.')
    err.code = 'NO_ACCOUNT'
    throw err
  }
  if (String(candidate.password||'') !== String(password||'')) {
    const err = new Error('Incorrect password.')
    err.code = 'BAD_PASSWORD'
    throw err
  }
  const { password: _pw, ...sessionUser } = candidate
  write({ ...sessionUser, ts: Date.now() })
  return getUser()
}
