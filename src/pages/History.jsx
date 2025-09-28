import React from 'react'
import { useTranslation } from 'react-i18next'
import { listMessages } from '../db/local.js'

export default function History() {
  const { t } = useTranslation()
  const items = listMessages(50)
  if (!items.length) return <div className="card p-4 dark:!bg-[#232427] dark:!border-[#2E2F33]">{t('no_history')}</div>
  return (
    <div className="grid gap-2">
      {items.map((m, idx) => (
        <div key={idx} className="card p-3 flex items-start gap-3 dark:!bg-[#232427] dark:!border-[#2E2F33]">
          <div aria-hidden className={`w-8 h-8 rounded-full flex items-center justify-center ${m.role==='user'?'bg-emerald-200':'bg-emerald-200'}`}>{m.role==='user'?'🧑':'🤖'}</div>
          <div className="flex-1">
            <div className="text-sm text-gray-600">{new Date(m.ts||Date.now()).toLocaleString()}</div>
            <div className="whitespace-pre-wrap">{m.content}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
