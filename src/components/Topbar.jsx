import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isLoggedIn, getUser } from '../store/auth.js'
import Logo from './Logo.jsx'

export default function Topbar({ onLogin, onSignup, onLogout, onNavigate, onToggleSidebar, children }) {
  const { t } = useTranslation()
  const [user, setUser] = useState(() => {
    const u = getUser(); return (u && u.role !== 'guest') ? u : null
  })
  const logged = !!user
  const [scrolled, setScrolled] = useState(false)
  const [notifOn, setNotifOn] = useState(() => {
    try { return !!JSON.parse(localStorage.getItem('curebot_ui') || '{}').notifications } catch { return true }
  })
  const [isDark, setIsDark] = useState(() => {
    try {
      const theme = JSON.parse(localStorage.getItem('curebot_theme') || 'null')
      return theme === 'dark'
    } catch { return false }
  })
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifs, setNotifs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('curebot_notifs')||'[]') } catch { return [] }
  })
  const notifBtnRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 2)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Apply theme on mount and when toggled
  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('curebot_theme', JSON.stringify('dark'))
    } else {
      root.classList.remove('dark')
      localStorage.setItem('curebot_theme', JSON.stringify('light'))
    }
  }, [isDark])

  useEffect(() => {
    const onAuth = (e) => {
      const u = e?.detail?.user || null
      setUser(u && u.role !== 'guest' ? u : null)
    }
    const onStorage = (e) => {
      if (e.key === 'curebot_auth_v1') {
        try {
          const u = e.newValue ? JSON.parse(e.newValue) : null
          setUser(u && u.role !== 'guest' ? u : null)
        } catch {}
      }
    }
    window.addEventListener('curebot:auth', onAuth)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('curebot:auth', onAuth)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  useEffect(() => {
    const onUI = (e) => {
      const detail = e?.detail || {}
      if (typeof detail.notifications !== 'undefined') setNotifOn(!!detail.notifications)
    }
    window.addEventListener('curebot:ui', onUI)
    return () => window.removeEventListener('curebot:ui', onUI)
  }, [])

  function persistUI(patch) {
    try {
      const ui = JSON.parse(localStorage.getItem('curebot_ui') || '{}')
      Object.assign(ui, patch)
      localStorage.setItem('curebot_ui', JSON.stringify(ui))
      window.dispatchEvent(new CustomEvent('curebot:ui', { detail: ui }))
    } catch {}
  }

  function toggleNotifications(v) {
    const next = typeof v === 'boolean' ? v : !notifOn
    setNotifOn(next)
    persistUI({ notifications: next })
  }

  // Notifications: listen for app-wide events to simulate live toasts
  useEffect(() => {
    const onNotify = (e) => {
      const detail = e?.detail || {}
      const item = {
        id: crypto.randomUUID(),
        title: detail.title || 'Notification',
        body: detail.body || 'You have a new message',
        ts: Date.now(),
      }
      setNotifs(prev => {
        const next = [item, ...prev].slice(0, 20)
        localStorage.setItem('curebot_notifs', JSON.stringify(next))
        return next
      })
      setNotifOpen(true)
    }
    window.addEventListener('curebot:notify', onNotify)
    return () => window.removeEventListener('curebot:notify', onNotify)
  }, [])

  // Close on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (!notifOpen) return
      if (!notifBtnRef.current) return
      if (!notifBtnRef.current.parentElement?.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [notifOpen])

  return (
    <div className={`sticky top-0 z-30 backdrop-blur border-b ${scrolled ? 'shadow-md' : 'shadow-sm'} bg-white border-[#CFE8D8] dark:bg-[#1A1B1E] dark:border-[#2E2F33]`}>
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span aria-hidden className="w-[60px] h-[60px] rounded-full bg-emerald-100 flex items-center justify-center border border-[#CFE8D8]"><Logo size={44} /></span>
          <span className="font-semibold text-2xl dark:text-white">{t('app_name')}</span>
        </div>
        <div className="flex-1"/>
        <div className="flex items-center gap-2">
          {children}
          <div className="relative">
            <button ref={notifBtnRef} type="button" className="btn-outline" aria-label={t('notifications')} title={notifOn ? 'Notifications on' : 'Notifications muted'} onClick={() => setNotifOpen(v=>!v)}>
              {notifOn ? (
                // Bell ON
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M15 17h5l-1.6-1.6c-.25-.25-.4-.59-.4-.94V11a6 6 0 1 0-12 0v3.46c0 .35-.14.69-.4.94L4 17h5"/>
                  <path d="M9 17a3 3 0 0 0 6 0"/>
                </svg>
              ) : (
                // Bell OFF (muted)
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  <path d="M21 21L3 3"/>
                  <path d="M6.26 6.26A6 6 0 0 0 6 8v3.5l-2 2V15h13"/>
                </svg>
              )}
            </button>
            {/* Theme toggle */}
            <button
              type="button"
              className="btn-outline ml-2 !px-3"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light mode' : 'Dark mode'}
              onClick={() => setIsDark(v => !v)}
            >
              {isDark ? '🌙' : '🌞'}
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white border border-[#CFE8D8] rounded-md shadow-lg overflow-hidden dark:bg-[#1A1B1E] dark:border-[#2E2F33]">
                <div className="px-3 py-2 border-b border-[#CFE8D8] flex items-center justify-between dark:border-[#2E2F33]">
                  <span className="text-sm font-semibold">Notifications</span>
                  <button className="text-xs text-gray-600 hover:underline" onClick={()=>{ setNotifs([]); localStorage.setItem('curebot_notifs', '[]') }}>Clear</button>
                </div>
                <div className="max-h-72 overflow-auto">
                  {notifs.length === 0 ? (
                    <div className="px-3 py-4 text-sm text-gray-600">No notifications</div>
                  ) : (
                    notifs.map(n => (
                      <div key={n.id} className="px-3 py-2 border-b border-[#CFE8D8] dark:border-[#2E2F33]">
                        <div className="text-sm font-medium">{n.title}</div>
                        <div className="text-xs text-gray-600">{n.body}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{new Date(n.ts).toLocaleString()}</div>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-3 py-2 bg-white flex items-center gap-2 border-t border-[#CFE8D8] dark:bg-[#1A1B1E] dark:border-[#2E2F33]">
                  <button className="btn-outline !px-3 !py-1 text-xs" onClick={()=>{
                    const demo = { title: 'New message', body: 'You have a new health tip.', ts: Date.now(), id: crypto.randomUUID() }
                    setNotifs(prev=>{ const next=[demo, ...prev].slice(0,20); localStorage.setItem('curebot_notifs', JSON.stringify(next)); return next })
                  }}>Generate sample</button>
                  <button className="btn-outline !px-3 !py-1 text-xs" onClick={()=>toggleNotifications(!notifOn)}>{notifOn ? 'Mute' : 'Unmute'}</button>
                </div>
              </div>
            )}
          </div>
          {logged ? (
            <div className="flex items-center gap-2">
              <button className="btn-outline" onClick={() => onNavigate('account')} aria-label={t('profile')}>
                {user?.name ? user.name : t('profile')}
              </button>
              <button className="btn !bg-emerald-600" onClick={onLogout}>{t('logout')}</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button className="btn-outline min-w-[130px] flex items-center justify-center" onClick={onLogin}>{t('login')}</button>
              <button className="btn min-w-[130px] flex items-center justify-center" onClick={onSignup}>{t('signup')}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
