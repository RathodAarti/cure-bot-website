import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { register } from '../store/auth.js'

export default function Signup({ onDone }) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  function isStrong(pwd) {
    if (!pwd) return false
    const hasUpper = /[A-Z]/.test(pwd)
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd)
    return hasUpper && hasSpecial
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!isStrong(password)) {
      alert('Invalid password: must include at least 1 uppercase letter and 1 special character.')
      return
    }
    if (password !== confirm) {
      alert('Incorrect password: Password and Confirm password do not match')
      return
    }
    try {
      const user = register({ name: name || t('you'), email, password })
      try {
        window.dispatchEvent(new CustomEvent('curebot:notify', {
          detail: {
            title: 'Complete your profile',
            body: 'Add your address, state, city and health details in your profile.',
          }
        }))
      } catch {}
      onDone?.(user)
    } catch (err) {
      alert(err?.message || 'Signup failed')
    }
  }

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <div className="max-w-md w-full card p-5">
        <h2 className="text-xl font-semibold mb-3">{t('signup')}</h2>
        <form onSubmit={handleSubmit} className="grid gap-3">
        <label className="grid gap-1">
          <span className="text-sm">{t('name')}</span>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder={t('name_placeholder')} required />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">{t('email')}</span>
          <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Create password</span>
          <div className="relative">
            <input
              className="input pr-12"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e=>setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-emerald-600 hover:underline"
              onClick={() => setShowPassword(s => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M3 3l18 18" />
                  <path d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58M9.88 4.24A9.77 9.77 0 0112 4c5 0 9 4 10 8-.288 1.154-.838 2.237-1.6 3.18M6.61 6.61C4.93 7.77 3.58 9.42 3 12c1 4 5 8 10 8 1.34 0 2.62-.26 3.78-.74" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {!!password && !isStrong(password) && (
            <span className="text-xs text-red-600">Must contain at least 1 uppercase and 1 special character.</span>
          )}
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Confirm password</span>
          <div className="relative">
            <input
              className="input pr-12"
              type={showConfirm ? 'text' : 'password'}
              value={confirm}
              onChange={e=>setConfirm(e.target.value)}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-emerald-600 hover:underline"
              onClick={() => setShowConfirm(s => !s)}
              aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirm ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M3 3l18 18" />
                  <path d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58M9.88 4.24A9.77 9.77 0 0112 4c5 0 9 4 10 8-.288 1.154-.838 2.237-1.6 3.18M6.61 6.61C4.93 7.77 3.58 9.42 3 12c1 4 5 8 10 8 1.34 0 2.62-.26 3.78-.74" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {!!confirm && confirm !== password && (
            <span className="text-xs text-red-600">Passwords do not match.</span>
          )}
        </label>
          <button type="submit" className="btn">{t('create_account')}</button>
        </form>
      </div>
    </div>
  )
}

