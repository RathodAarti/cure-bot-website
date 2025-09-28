import React from 'react'
import { useTranslation } from 'react-i18next'

export default function SourcePanel({ sources = [] }) {
  const { t } = useTranslation()
  if (!sources?.length) return null
  return (
    <div className="grid gap-1" aria-label={t('sources')}>
      <h3 className="font-semibold text-sm">{t('sources')}</h3>
      <ul className="list-disc pl-6">
        {sources.map((s, idx) => (
          <li key={idx}>
            {s.snippet && (
              <blockquote className="text-sm text-gray-700 border-l-4 border-gray-300 pl-3 mb-1 whitespace-pre-wrap">
                {s.snippet}
              </blockquote>
            )}
            {s.title && (
              <div className="text-xs text-gray-600">{s.title}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
