import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getUser, updateUser, deleteAccount } from '../store/auth.js'
import { listMessages } from '../db/local.js'

export default function Settings({ onClearMessages, onClearAll, onToggleSidebarDefault }) {
  const { t, i18n } = useTranslation()
  const user = getUser()
  const [lang, setLang] = useState(i18n.language)
  const [notify, setNotify] = useState(() => {
    try { return !!JSON.parse(localStorage.getItem('curebot_ui') || '{}').notifications } catch { return true }
  })
  const [emergency, setEmergency] = useState(user?.emergency || '')
  // Theme: system | light | dark
  const [theme, setTheme] = useState(() => {
    try { return JSON.parse(localStorage.getItem('curebot_theme') || '"system"') } catch { return 'system' }
  })

  function saveLang(e) { const v = e.target.value; setLang(v); i18n.changeLanguage(v) }
  function saveEmergency() { updateUser({ emergency }) }

  function persistUI(patch) {
    try {
      const ui = JSON.parse(localStorage.getItem('curebot_ui') || '{}')
      Object.assign(ui, patch)
      localStorage.setItem('curebot_ui', JSON.stringify(ui))
      window.dispatchEvent(new CustomEvent('curebot:ui', { detail: ui }))
    } catch {}
  }

  async function exportProfile() {
    const profile = getUser() || {}
    const msgs = listMessages(1000)
    const data = { profile, messages: msgs }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `curebot-profile-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  async function requestNotifications() {
    if (!('Notification' in window)) { alert('Notifications are not supported in this browser.'); return }
    try {
      const perm = await Notification.requestPermission()
      alert(`Notification permission: ${perm}`)
    } catch {
      alert('Unable to request notifications')
    }
  }

  function resetDefaults() {
    try {
      localStorage.removeItem('curebot_ui')
      setTheme('system')
      setNotify(true)
      window.dispatchEvent(new CustomEvent('curebot:ui', { detail: {} }))
      alert('Defaults restored')
    } catch {}
  }

  function handleDeleteAccount() {
    if (!confirm('Are you sure you want to delete your account from this device? This will sign you out and remove local profile data.')) return
    deleteAccount()
    alert('Account removed locally.')
  }

  useEffect(() => { persistUI({ notifications: notify }) }, [notify])
  useEffect(() => {
    try {
      localStorage.setItem('curebot_theme', JSON.stringify(theme))
      window.dispatchEvent(new CustomEvent('curebot:theme', { detail: { mode: theme } }))
    } catch {}
  }, [theme])

  async function exportMessages() {
    const msgs = listMessages(1000)
    const blob = new Blob([JSON.stringify(msgs, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `curebot-messages-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="grid gap-4">
      <div className="card p-5">
        <h2 className="text-lg font-semibold mb-2">{t('settings')}</h2>
        <div className="grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm">{t('language')}</span>
            <select value={lang} onChange={saveLang} className="input !h-10">
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Emergency contact (phone)</span>
            <input className="input" value={emergency} onChange={(e)=>setEmergency(e.target.value)} placeholder="9999999999" />
            <div>
              <button className="btn !bg-white !text-gray-700 border border-gray-300 dark:!bg-[#232427] dark:!text-gray-100 dark:border-[#2E2F33]" onClick={saveEmergency}>Save</button>
            </div>
          </label>

          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={notify} onChange={(e)=>setNotify(e.target.checked)} />
            <span>Enable notifications</span>
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Theme</span>
            <select value={theme} onChange={(e)=>setTheme(e.target.value)} className="input !h-10">
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>

          <div className="flex flex-wrap gap-2">
            <button className="btn !bg-white !text-gray-700 border border-gray-300 dark:!bg-[#232427] dark:!text-gray-100 dark:border-[#2E2F33]" onClick={onToggleSidebarDefault}>Toggle sidebar by default</button>
            <button className="btn !bg-white !text-gray-700 border border-gray-300 dark:!bg-[#232427] dark:!text-gray-100 dark:border-[#2E2F33]" onClick={onClearMessages}>Clear chat history</button>
            <button className="btn" onClick={onClearAll}>Clear all data</button>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="text-lg font-semibold mb-2">Privacy & Data</h3>
        <div className="flex flex-wrap gap-2">
          <button className="btn !bg-white !text-gray-700 border border-gray-300 dark:!bg-[#232427] dark:!text-gray-100 dark:border-[#2E2F33]" onClick={exportMessages}>Export messages (JSON)</button>
          <button className="btn !bg-white !text-gray-700 border border-gray-300 dark:!bg-[#232427] dark:!text-gray-100 dark:border-[#2E2F33]" onClick={exportProfile}>Download profile (JSON)</button>
          <button className="btn !bg-white !text-gray-700 border border-gray-300 dark:!bg-[#232427] dark:!text-gray-100 dark:border-[#2E2F33]" onClick={requestNotifications}>Request notification permission</button>
          <button className="btn !bg-white !text-gray-700 border border-gray-300 dark:!bg-[#232427] dark:!text-gray-100 dark:border-[#2E2F33]" onClick={resetDefaults}>Reset to defaults</button>
          <button className="btn" onClick={handleDeleteAccount}>Delete account (local)</button>
        </div>
      </div>
    </div>
  )
}
