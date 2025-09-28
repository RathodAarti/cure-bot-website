import React, { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getUser, updateUser } from '../store/auth.js'
import { states as IN_STATES, citiesByState as IN_CITIES } from '../data/indiaLocations.js'

export default function Account() {
  const { t } = useTranslation()
  const [user, setUser] = useState(getUser())
  const fileRef = useRef(null)

  if (!user) return <div className="card p-4">{t('not_logged_in')}</div>

  async function onPick(e) {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      const u = updateUser({ avatar: reader.result })
      setUser(u)
    }
    reader.readAsDataURL(f)
  }
  return (
    <div className="grid gap-6">
      <div className="card p-6 text-center">
        <div className="mx-auto w-28 h-28 rounded-full bg-emerald-100 border border-emerald-200 overflow-hidden flex items-center justify-center">
          {user?.avatar ? (
            <img src={user.avatar} alt={t('profile')} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl">👤</span>
          )}
        </div>
        <div className="mt-3">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPick} />
          <button className="btn-outline" onClick={() => fileRef.current?.click()}>{t('image')}</button>
        </div>
        <h2 className="text-xl font-semibold mt-4">{user.name || t('you')}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-100">{user.email || user.phone || ''}</p>
      </div>

      <PersonalDetailsCard user={user} setUser={setUser} />

      {/* Health details */}
      <HealthDetailsCard user={user} setUser={setUser} />

      {/* Accessibility & Reports */}
      <AccessibilityCard user={user} setUser={setUser} />
    </div>
  )
}

function PersonalDetailsCard({ user, setUser }) {
  const { t } = useTranslation()
  const [name, setName] = useState(user.name || '')
  const [email, setEmail] = useState(user.email || '')
  const [address, setAddress] = useState(user.address || '')
  const [stateVal, setStateVal] = useState(user.state || '')
  const [city, setCity] = useState(user.city || '')
  const [cityOther, setCityOther] = useState('')
  const cities = useMemo(() => IN_CITIES[stateVal] || [], [stateVal])

  function save() {
    const patch = {
      name: name || t('you'),
      email,
      address,
      state: stateVal,
      city: city === '__other__' ? cityOther : city,
    }
    const u = updateUser(patch)
    setUser(u)
    alert('Personal details saved')
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Personal details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="grid gap-1">
          <span className="text-sm text-gray-600 dark:text-gray-100">{t('name')}</span>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder={t('name_placeholder')} />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-600 dark:text-gray-100">{t('email')}</span>
          <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
        </label>
        <label className="grid gap-1 md:col-span-2">
          <span className="text-sm text-gray-600 dark:text-gray-100">Address</span>
          <input className="input" value={address} onChange={e=>setAddress(e.target.value)} placeholder="House no, Street, Area" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-600 dark:text-gray-100">State</span>
          <select className="input" value={stateVal} onChange={e=>{ setStateVal(e.target.value); setCity(''); setCityOther('') }}>
            <option value="">Select</option>
            {IN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-600 dark:text-gray-100">City</span>
          {stateVal ? (
            <>
              <select className="input" value={city} onChange={e=>setCity(e.target.value)}>
                <option value="">Select</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
                <option value="__other__">Other...</option>
              </select>
              {(city === '__other__' || cities.length === 0) && (
                <input className="input mt-2" value={cityOther} onChange={e=>setCityOther(e.target.value)} placeholder="Enter city or village" />
              )}
            </>
          ) : (
            <input className="input" value={city} onChange={e=>setCity(e.target.value)} placeholder="Select state first" disabled />
          )}
        </label>
      </div>
      <div className="mt-4">
        <button className="btn" onClick={save}>Save personal details</button>
      </div>
    </div>
  )
}

function HealthDetailsCard({ user, setUser }) {
  const { t } = useTranslation()
  const [age, setAge] = useState(user.age || '')
  const [gender, setGender] = useState(user.gender || '')
  const [height, setHeight] = useState(user.height_cm || '')
  const [weight, setWeight] = useState(user.weight_kg || '')
  const [conditions, setConditions] = useState(user.conditions || '')

  function computeBMI(h, w) {
    const hc = parseFloat(h), wk = parseFloat(w)
    if (!hc || !wk) return ''
    const m = hc / 100
    const bmi = wk / (m * m)
    return bmi ? bmi.toFixed(1) : ''
  }

  function save() {
    const patch = {
      age: age ? Number(age) : '',
      gender,
      height_cm: height ? Number(height) : '',
      weight_kg: weight ? Number(weight) : '',
      conditions: conditions || ''
    }
    const u = updateUser(patch)
    setUser(u)
    alert('Health details saved')
  }

  const bmi = computeBMI(height, weight)

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Health details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="grid gap-1">
          <span className="text-sm text-gray-600 dark:text-gray-100">Age</span>
          <input className="input" type="number" min="0" value={age} onChange={e=>setAge(e.target.value)} placeholder="e.g., 28" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-600 dark:text-gray-100">Gender</span>
          <select className="input !h-10" value={gender} onChange={e=>setGender(e.target.value)}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not">Prefer not to say</option>
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-600 dark:text-gray-100">Height (cm)</span>
          <input className="input" type="number" min="0" value={height} onChange={e=>setHeight(e.target.value)} placeholder="e.g., 170" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-600 dark:text-gray-100">Weight (kg)</span>
          <input className="input" type="number" min="0" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="e.g., 70" />
        </label>
        <label className="md:col-span-2 grid gap-1">
          <span className="text-sm text-gray-600 dark:text-gray-100">Health conditions</span>
          <textarea className="input !rounded-2xl !h-24 resize-y" value={conditions} onChange={e=>setConditions(e.target.value)} placeholder="e.g., diabetes, hypertension" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-600 dark:text-gray-100">BMI</span>
          <input className="input" value={bmi} readOnly placeholder="Auto-calculated" />
          <span className="text-[11px] text-gray-500 dark:text-gray-300">Based on height and weight.</span>
        </label>
      </div>
      <div className="mt-4">
        <button className="btn" onClick={save}>Save health details</button>
      </div>
    </div>
  )
}

function AccessibilityCard({ user, setUser }) {
  const [hasIssue, setHasIssue] = useState(!!user.accessibility_issue)
  const [desc, setDesc] = useState(user.accessibility_desc || '')
  const [reports, setReports] = useState(Array.isArray(user.reports) ? user.reports : [])
  const fileRef = useRef(null)

  function onPick(e) {
    const f = e.target.files?.[0]; if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      const next = [...reports, { id: crypto.randomUUID(), name: f.name, dataUrl: reader.result }]
      setReports(next)
    }
    reader.readAsDataURL(f)
  }

  function removeReport(id) {
    setReports(prev => prev.filter(r => r.id !== id))
  }

  function save() {
    const patch = { accessibility_issue: hasIssue, accessibility_desc: desc, reports }
    const u = updateUser(patch)
    setUser(u)
    alert('Accessibility saved')
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Accessibility & Reports</h3>
      <div className="grid gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-100">Any physical issues or disability?</span>
          <label className="inline-flex items-center gap-1"><input type="radio" name="acc" checked={hasIssue===true} onChange={()=>setHasIssue(true)} /> Yes</label>
          <label className="inline-flex items-center gap-1"><input type="radio" name="acc" checked={hasIssue===false} onChange={()=>setHasIssue(false)} /> No</label>
        </div>
        <label className="grid gap-1">
          <span className="text-sm text-gray-600 dark:text-gray-100">Please describe (optional)</span>
          <textarea className="input !rounded-2xl !h-24 resize-y" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="e.g., mobility support needed" />
        </label>
        <div className="grid gap-2">
          <div>
            <input ref={fileRef} type="file" className="hidden" onChange={onPick} />
            <button type="button" className="btn-outline" onClick={()=>fileRef.current?.click()}>Attach report</button>
          </div>
          {reports.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-gray-300">No reports attached.</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {reports.map(r => (
                <span key={r.id} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-300 text-sm dark:bg-[#232427] dark:border-[#2E2F33] dark:text-gray-100">
                  {r.name}
                  <button type="button" className="icon-btn !w-7 !h-7 !p-0" onClick={()=>removeReport(r.id)}>✕</button>
                </span>
              ))}
            </div>
          )}
        </div>
        <div>
          <button className="btn" onClick={save}>Save accessibility</button>
        </div>
      </div>
    </div>
  )
}
