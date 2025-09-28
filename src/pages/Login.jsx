import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { loginWithPassword, recoverPassword } from '../store/auth.js'

export default function Login({ onDone }) {
  const { t } = useTranslation()
  const [mode, setMode] = useState('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

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
    try {
      const user = loginWithPassword({
        email: mode === 'email' ? email : undefined,
        phone: mode === 'phone' ? phone : undefined,
        password: password,
      })
      onDone?.(user)
    } catch (err) {
      alert(err?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <div className="max-w-md w-full card p-5 dark:!text-gray-100">
        <h2 className="text-xl font-semibold mb-3">{t('login')}</h2>
        <form onSubmit={handleSubmit} className="grid gap-3">
        <div className="flex gap-4">
          <label className="flex items-center gap-2 dark:text-gray-100"><input type="radio" name="mode" checked={mode==='email'} onChange={()=>setMode('email')} /> {t('email')}</label>
          <label className="flex items-center gap-2 dark:text-gray-100"><input type="radio" name="mode" checked={mode==='phone'} onChange={()=>setMode('phone')} /> {t('phone')}</label>
        </div>
        {mode === 'email' ? (
          <label className="grid gap-1">
            <span className="text-sm dark:text-gray-100">{t('email')}</span>
            <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required />
          </label>
        ) : (
          <label className="grid gap-1">
            <span className="text-sm dark:text-gray-100">{t('phone')}</span>
            <input className="input" type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="9999999999" required />
          </label>
        )}
        <label className="grid gap-1">
          <span className="text-sm dark:text-gray-100">Password</span>
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
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
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
            <span className="text-xs text-red-600 dark:text-red-400">Must contain at least 1 uppercase and 1 special character.</span>
          )}
        </label>
        <div className="text-right -mt-1">
          <button
            type="button"
            className="text-sm text-emerald-600 hover:underline dark:text-emerald-400"
            onClick={() => {
              try {
                if (mode === 'email' && !email) { alert('Please enter your registered email first.'); return }
                if (mode === 'phone' && !phone) { alert('Please enter your registered phone first.'); return }
                const pwd = recoverPassword({ email: mode==='email' ? email : undefined, phone: mode==='phone' ? phone : undefined })
                // Simulate email send and notify
                try {
                  window.dispatchEvent(new CustomEvent('curebot:notify', { detail: { title: 'Password recovery', body: 'Your old password has been sent to your registered email.' } }))
                } catch {}
                alert(`Demo: Your old password was: ${pwd}`)
              } catch (err) {
                alert(err?.message || 'Could not recover password')
              }
            }}
          >
            ? Forgot password
          </button>
        </div>
          <button type="submit" className="btn">{t('continue')}</button>
        </form>
      </div>
    </div>
  )
}

