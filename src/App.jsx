import React, { useEffect, useState } from 'react'
import ChatBox from './components/ChatBox.jsx'
import Landing from './components/Landing.jsx'
import Topbar from './components/Topbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Account from './pages/Account.jsx'
import History from './pages/History.jsx'
import About from './pages/About.jsx'
import Settings from './pages/Settings.jsx'
import { useTranslation } from 'react-i18next'
import { getBackendMode, setBackendMode } from './adapters/proxy.js'
import { logout as authLogout, isLoggedIn } from './store/auth.js'
import { guestLogin } from './store/auth.js'
import { sendWhatsApp } from './adapters/proxy.js'
import * as DB from './db/local.js'

export default function App() {
  const { i18n, t } = useTranslation()
  const [channel, setChannel] = useState('http') // 'http' | 'ws'
  const [backend, setBackend] = useState(getBackendMode()) // 'live' | 'mock'
  const [started, setStarted] = useState(false)
  const [page, setPage] = useState('chat') // chat|history|account|settings|login|signup|summary
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try { return JSON.parse(localStorage.getItem('curebot_ui') || '{}').sidebarOpen ?? true } catch { return true }
  })
  const [showTab, setShowTab] = useState(false)
  const tabTimerRef = React.useRef(null)

  useEffect(() => {
    setBackendMode(backend)
  }, [backend])

  useEffect(() => {
    try {
      const ui = JSON.parse(localStorage.getItem('curebot_ui') || '{}')
      ui.sidebarOpen = sidebarOpen
      localStorage.setItem('curebot_ui', JSON.stringify(ui))
    } catch {}
  }, [sidebarOpen])

  // When sidebar hides, show the floating tab briefly, then auto-hide. Re-show on edge hover.
  useEffect(() => {
    if (!sidebarOpen) {
      setShowTab(true)
      if (tabTimerRef.current) clearTimeout(tabTimerRef.current)
      tabTimerRef.current = setTimeout(() => setShowTab(false), 2500)
    } else {
      setShowTab(false)
      if (tabTimerRef.current) { clearTimeout(tabTimerRef.current); tabTimerRef.current = null }
    }
    return () => { if (tabTimerRef.current) { clearTimeout(tabTimerRef.current); tabTimerRef.current = null } }
  }, [sidebarOpen])

  async function handleCallClinician() {
    try {
      await sendWhatsApp({ message: t('need_help_msg') })
      alert(t('whatsapp_sent'))
    } catch {
      alert(t('whatsapp_failed'))
    }
  }

  async function handleEmergency() {
    try {
      await sendWhatsApp({ message: t('emergency_alert') })
      alert(t('whatsapp_sent'))
    } catch {
      alert(t('whatsapp_failed'))
    }
  }

  function renderMain() {
    if (!started) return <Landing onStart={() => { setStarted(true); setPage('chat') }} />
    switch (page) {
      case 'chat':
        return <ChatBox channel={channel} />
      case 'history':
        return <History />
      case 'account':
        return <Account />
      case 'login':
        return <Login onDone={() => setPage('account')} />
      case 'signup':
        return <Signup onDone={() => setPage('account')} />
      case 'settings':
        return (
          <Settings
            onToggleSidebarDefault={() => setSidebarOpen(v => !v)}
            onClearMessages={() => { localStorage.setItem('curebot_local_db_v1', JSON.stringify({ ...JSON.parse(localStorage.getItem('curebot_local_db_v1')||'{}'), messages: [] })); alert('Chat history cleared') }}
            onClearAll={() => { localStorage.clear(); alert('All local data cleared') }}
          />
        )
      case 'about':
        return <About />
      default:
        return <ChatBox channel={channel} />
    }
  }

  // Landing-only view (matches provided screenshot) until user clicks CTA
  if (!started) {
    return (
      <div className="min-h-screen grid grid-rows-[1fr_auto]">
        <main className="mx-auto max-w-4xl w-full p-6">
          <Landing onStart={() => { guestLogin(); setStarted(true); setPage('chat') }} />
        </main>
        <footer className="bg-transparent">
          <div className="mx-auto max-w-4xl p-4 text-sm text-gray-600 text-center">
            {t('disclaimer')}
          </div>
        </footer>
      </div>
    )
  }

  // Full app shell after start
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
      <Topbar
        onLogin={() => setPage('login')}
        onSignup={() => setPage('signup')}
        onLogout={() => { authLogout(); setPage('chat') }}
        onGuest={() => { guestLogin(); setPage('chat') }}
        onNavigate={(dest) => setPage(dest)}
        onToggleSidebar={() => setSidebarOpen(v => !v)}
      >
        {/* controls moved to Sidebar */}
      </Topbar>
      <div className="grid" style={{gridTemplateColumns: sidebarOpen ? '240px 1fr' : '1fr'}}>
        {sidebarOpen && (
          <Sidebar
            current={page}
            onNavigate={(id)=> setPage(id)}
            onCallClinician={handleCallClinician}
            onEmergency={handleEmergency}
            onHide={() => setSidebarOpen(false)}
            language={i18n.language}
            onChangeLanguage={(lng)=> i18n.changeLanguage(lng)}
            backend={backend}
            onChangeBackend={(b)=> setBackend(b)}
            channel={channel}
            onChangeChannel={(c)=> setChannel(c)}
          />
        )}
        <main className="mx-auto max-w-[960px] w-full px-4 pt-4 pb-0 bg-white dark:bg-[#121212]">
          {renderMain()}
        </main>
      </div>
      {!sidebarOpen && (
        <>
          {/* hover hotzone at far-left edge */}
          <div
            className="fixed left-0 top-0 h-full w-1"
            style={{ zIndex: 39 }}
            onMouseEnter={() => {
              if (tabTimerRef.current) { clearTimeout(tabTimerRef.current); tabTimerRef.current = null }
              setShowTab(true)
            }}
          />
          <button
            type="button"
            className="fixed left-0 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md rounded-r-full px-2.5 py-3 transition-all"
            style={{ zIndex: 40, transform: `translateY(-50%) translateX(${showTab ? '0' : '-80%'})`, opacity: showTab ? 1 : 0.6 }}
            aria-label="Show menu"
            title="Show menu"
            onMouseEnter={() => {
              if (tabTimerRef.current) { clearTimeout(tabTimerRef.current); tabTimerRef.current = null }
              setShowTab(true)
            }}
            onMouseLeave={() => {
              if (tabTimerRef.current) { clearTimeout(tabTimerRef.current) }
              tabTimerRef.current = setTimeout(() => setShowTab(false), 1500)
            }}
            onClick={() => setSidebarOpen(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M10 6 L14 12 L10 18"/>
            </svg>
          </button>
        </>
      )}
      <footer className="bg-white border-t border-[#CFE8D8] dark:bg-[#121212] dark:border-[#2E2F33]">
        <div className="mx-auto max-w-6xl p-4 text-sm text-gray-600 dark:text-gray-400">
          {t('disclaimer')}
        </div>
      </footer>
    </div>
  )
}
