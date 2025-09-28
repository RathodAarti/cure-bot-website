import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { register } from '../store/auth.js'

export default function Signup({ onDone }) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
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
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Confirm password</span>
          <input className="input" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="••••••••" required />
        </label>
          <button type="submit" className="btn">{t('create_account')}</button>
        </form>
      </div>
    </div>
  )
}
