import React from 'react'
import { useTranslation } from 'react-i18next'
import { getUser } from '../store/auth.js'

export default function ProfileSummary({ onGoToAccount, onGoHome }) {
  const { t } = useTranslation()
  const user = getUser()

  if (!user) {
    return (
      <div className="card p-5">
        <h2 className="text-xl font-semibold mb-2">Profile</h2>
        <div className="text-sm text-gray-600">{t('not_logged_in')}</div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[960px] w-full grid gap-6">
      {/* Header card with avatar, name, email/phone */}
      <div className="card p-6 text-center">
        <div className="mx-auto w-28 h-28 rounded-full bg-emerald-100 border border-[#CFE8D8] overflow-hidden flex items-center justify-center">
          {user?.avatar ? (
            <img src={user.avatar} alt={t('profile')} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl">👤</span>
          )}
        </div>
        <div className="mt-3">
          <button className="btn-outline" onClick={onGoToAccount}>Image</button>
        </div>
        <h2 className="text-xl font-semibold mt-4">{user.name || t('you')}</h2>
        <p className="text-sm text-gray-600">{user.email || user.phone || ''}</p>
      </div>

      {/* Personal details (read-only) */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Personal details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label={t('name')} value={user.name || ''} />
          <Field label={t('email')} value={user.email || ''} />
          <Field label="Address" value={user.address || ''} className="md:col-span-2" />
          <Field label="State" value={user.state || ''} />
          <Field label="City" value={user.city || ''} />
        </div>
      </div>

      {/* Health details (read-only) */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Health details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Age" value={hasValue(user.age) ? String(user.age) : ''} />
          <Field label="Gender" value={user.gender || ''} />
          <Field label="Height (cm)" value={hasValue(user.height_cm) ? String(user.height_cm) : ''} />
          <Field label="Weight (kg)" value={hasValue(user.weight_kg) ? String(user.weight_kg) : ''} />
          <Field label="Health conditions" value={user.conditions || ''} className="md:col-span-2" textarea />
          <Field label="BMI" value={computeBMI(user.height_cm, user.weight_kg)} helper="Based on height and weight." />
        </div>
      </div>

      {/* Accessibility & Reports (read-only preview) */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Accessibility & Reports</h3>
        <div className="grid gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-100">Any physical issues or disability?</span>
            <span className="text-sm">{user.accessibility_issue ? 'Yes' : 'No'}</span>
          </div>
          <Field label="Please describe (optional)" value={user.accessibility_desc || ''} textarea />
          <div className="grid gap-2">
            <div className="text-sm text-gray-600 dark:text-gray-100">Reports</div>
            {Array.isArray(user.reports) && user.reports.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.reports.map(r => (
                  <span key={r.id} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-300 text-sm dark:bg-[#232427] dark:border-[#2E2F33] dark:text-gray-100">
                    {r.name || 'Report'}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-300">No reports attached.</div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <button className="btn" onClick={onGoToAccount}>Edit Profile</button>
        <button className="btn-outline" onClick={onGoHome}>Go to Chat</button>
      </div>
    </div>
  )
}

function Field({ label, value, textarea = false, helper, className = '' }) {
  return (
    <label className={`grid gap-1 ${className}`}>
      <span className="text-sm text-gray-600">{label}</span>
      {textarea ? (
        <textarea className="input !rounded-2xl !h-24 resize-y" value={value} readOnly />
      ) : (
        <input className="input" value={value} readOnly />
      )}
      {helper ? <span className="text-[11px] text-gray-500">{helper}</span> : null}
    </label>
  )
}

function hasValue(v) {
  return typeof v !== 'undefined' && v !== null && v !== ''
}

function computeBMI(height_cm, weight_kg) {
  const hc = parseFloat(height_cm), wk = parseFloat(weight_kg)
  if (!hc || !wk) return ''
  const m = hc / 100
  const bmi = wk / (m * m)
  return bmi ? bmi.toFixed(1) : ''
}
