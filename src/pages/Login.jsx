import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { loginWithPassword, recoverPassword } from '../store/auth.js'

export default function Login({ onDone }) {
  const { t } = useTranslation()
  const [mode, setMode] = useState('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
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
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required />
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
