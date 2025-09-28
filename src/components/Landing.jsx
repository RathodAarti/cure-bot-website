import React from 'react'
import Logo from './Logo.jsx'
import { useTranslation } from 'react-i18next'

export default function Landing({ onStart }) {
  const { t } = useTranslation()
  const [isDark, setIsDark] = React.useState(() => {
    try {
      const theme = JSON.parse(localStorage.getItem('curebot_theme') || 'null')
      return theme === 'dark'
    } catch { return false }
  })

  React.useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('curebot_theme', JSON.stringify('dark'))
    } else {
      root.classList.remove('dark')
      localStorage.setItem('curebot_theme', JSON.stringify('light'))
    }
  }, [isDark])
  return (
    <section className="min-h-[70vh] flex items-center justify-center">
      <div className="mx-auto max-w-3xl w-full text-center px-4">
        <div className="flex items-center justify-end py-2">
          <button
            type="button"
            className="btn-outline !px-3"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
            onClick={() => setIsDark(v => !v)}
          >
            {isDark ? '🌙' : '🌞'}
          </button>
        </div>
        <div className="rounded-3xl p-10 border shadow-sm bg-[linear-gradient(180deg,#EAF7F0_0%,#FFFFFF_100%)] border-[#CFE8D8] dark:bg-none dark:bg-[#1A1B1E] dark:border-[#2E2F33]">
          <div className="w-[90px] h-[90px] mx-auto mb-6 rounded-2xl bg-white shadow flex items-center justify-center dark:bg-[#232427] dark:border dark:border-[#2E2F33]">
            <Logo size={72} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-gray-100">{t('landing_title')}</h2>
          <p className="mt-3 text-slate-600 dark:text-gray-400">{t('landing_subtitle')}</p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Feature icon="💙" title={t('landing_care_title')} desc={t('landing_care_desc')} />
            <Feature icon="🔒" title={t('landing_privacy_title')} desc={t('landing_privacy_desc')} />
            <Feature icon="🕘" title={t('landing_247_title')} desc={t('landing_247_desc')} />
          </div>

          <div className="mt-8">
            <button type="button" onClick={onStart} className="btn !bg-emerald-600 dark:!bg-[#232427] dark:hover:!bg-[#2E2F33]">
              {t('landing_cta')}
            </button>
          </div>

          <p className="mt-6 text-xs text-slate-500 dark:text-gray-500 max-w-2xl mx-auto">
            {t('disclaimer')}
          </p>
        </div>
      </div>
    </section>
  )
}

function Feature({ icon, title, desc }) {
  return (
    <div className="card p-4 text-left bg-white dark:!bg-[#232427] dark:!border-[#2E2F33]">
      <div className="text-2xl">{icon}</div>
      <div className="mt-2 font-semibold dark:text-gray-100">{title}</div>
      <div className="text-sm text-slate-600 dark:text-gray-400">{desc}</div>
    </div>
  )
}
