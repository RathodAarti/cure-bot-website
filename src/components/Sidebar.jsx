import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function Sidebar({ current, onNavigate, onCallClinician, onEmergency, onHide, language, onChangeLanguage, backend, onChangeBackend, channel, onChangeChannel }) {
  const { t } = useTranslation()
  const Icon = {
    chat: (props) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
      </svg>
    ),
    history: (props) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l3 3"/>
      </svg>
    ),
    account: (props) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    settings: (props) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .66.26 1.3.73 1.77.47.47 1.11.73 1.77.73H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    )
  }
  const items = [
    { id: 'account', label: t('nav_account'), icon: Icon.account },
    { id: 'about', label: t('nav_about'), icon: (props) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
      </svg>
    ) },
    { id: 'settings', label: t('nav_settings'), icon: Icon.settings },
  ]
  return (
    <aside className="hidden md:block w-60 bg-white border-r border-[#CFE8D8] sticky top-0 self-start h-[100vh] shadow-sm dark:bg-[#1A1B1E] dark:border-[#2E2F33]">
      <div className="h-full flex flex-col">
        <div className="px-4 py-3 text-base font-semibold flex items-center justify-between">
          <span className="dark:text-white">{t('app_name')}</span>
          <CollapseButton onHide={onHide} />
        </div>
        <div className="border-t border-[#CFE8D8] dark:border-[#2E2F33]" />
        <div className="p-3">
          <button
            type="button"
            className="w-full px-4 py-2 rounded-md border text-gray-800 bg-white hover:bg-white border-[#CFE8D8] dark:border-[#2E2F33] dark:text-gray-100 dark:bg-[#1A1B1E] dark:hover:bg-[#232427]"
            onClick={() => { onNavigate('chat'); window.dispatchEvent(new CustomEvent('curebot:newchat')) }}
          >
            + {t('new_chat')}
          </button>
        </div>
        {/* push the rest to the bottom */}
        <div className="flex-1" />
        <div className="border-t border-[#CFE8D8] dark:border-[#2E2F33]" />
        <nav className="overflow-auto py-2 text-sm">
          {items.map(it => (
            <button key={it.id} onClick={() => onNavigate(it.id)}
              className={`w-full text-left px-4 py-2 rounded-md hover:bg-white focus:bg-white focus:outline-none dark:hover:bg-[#232427] dark:focus:bg-[#232427] dark:text-gray-100 ${current === it.id ? 'bg-white dark:bg-[#232427] font-semibold' : ''}`}
              aria-current={current === it.id ? 'page' : undefined}>
              <span className="mr-2 inline-flex items-center text-gray-700 dark:text-gray-100" aria-hidden>{typeof it.icon === 'function' ? it.icon({}) : it.icon}</span>{it.label}
            </button>
          ))}
        </nav>
        {/* Bottom-left Quick Actions and Settings section removed as requested */}
      </div>
    </aside>
  )
}

function CollapseButton({ onHide }) {
  const [rot, setRot] = useState(false)
  return (
    <button
      type="button"
      className="btn-outline !px-3 !py-1"
      title="Hide sidebar"
      aria-label="Hide sidebar"
      onClick={() => { setRot(true); setTimeout(() => onHide?.(), 150) }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden
        style={{ transform: rot ? 'rotate(-180deg)' : 'rotate(0deg)', transition: 'transform 150ms ease' }}>
        <path d="M14 6 L10 12 L14 18"/>
      </svg>
    </button>
  )
}
