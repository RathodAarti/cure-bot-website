import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { sendFeedback } from '../adapters/proxy.js'

export default function Feedback({ messageId }) {
  const { t } = useTranslation()
  const [status, setStatus] = useState('idle') // idle|sent|error
  const [open, setOpen] = useState(false)

  async function vote(value) {
    setStatus('sending')
    try {
      await sendFeedback({ messageId, value })
      setStatus('sent')
    } catch (e) {
      setStatus('error')
    }
  }

  if (!open && status !== 'sent') {
    return (
      <button type="button" className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-300 text-xs hover:bg-gray-200"
        onClick={() => setOpen(true)} aria-label={t('give_feedback')}>
        {t('give_feedback')}
      </button>
    )
  }

  return (
    <div role="group" aria-label={t('feedback')} className="flex items-center gap-2">
      {status !== 'sent' && (
        <>
          <button
            type="button"
            className="icon-btn hover:scale-105 transition-transform"
            onClick={() => vote('up')}
            aria-label={t('thumbs_up')}
            title={t('thumbs_up')}
          >👍</button>
          <button
            type="button"
            className="icon-btn hover:scale-105 transition-transform"
            onClick={() => vote('down')}
            aria-label={t('thumbs_down')}
            title={t('thumbs_down')}
          >👎</button>
        </>
      )}
      {status === 'sent' && <span className="text-xs text-emerald-700">{t('thanks')}</span>}
      {status === 'error' && <span className="text-xs text-rose-700">{t('error_generic')}</span>}
    </div>
  )
}
