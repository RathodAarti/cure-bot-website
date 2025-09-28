import React, { useEffect, useMemo, useRef, useState } from 'react'
import VoiceButton from './VoiceButton.jsx'
import SourcePanel from './SourcePanel.jsx'
import Logo from './Logo.jsx'
import { sendChat, sendWhatsApp, createWS } from '../adapters/proxy.js'
import { useTranslation } from 'react-i18next'

// initial message will be set using i18n inside component

export default function ChatBox({ channel = 'http' }) {
  const { t } = useTranslation()
  const [messages, setMessages] = useState(() => [
    { id: 'm1', role: 'assistant', content: t('greeting'), sources: [], done: true, ts: Date.now() }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [attachments, setAttachments] = useState([]) // [{id, name, type, dataUrl?}]
  const [typeahead, setTypeahead] = useState([])
  const listRef = useRef(null)
  const wsRef = useRef(null)
  const imgRef = useRef(null)
  const fileRef = useRef(null)

  useEffect(() => {
    if (channel !== 'ws') return
    const ws = createWS({ onMessage })
    ws.connect()
    wsRef.current = ws
    return () => ws.close()
  }, [channel])

  useEffect(() => {
    const handler = () => setMessages([{ id: 'm1', role: 'assistant', content: t('greeting'), sources: [], done: true, ts: Date.now() }])
    window.addEventListener('curebot:newchat', handler)
    return () => window.removeEventListener('curebot:newchat', handler)
  }, [t])

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function addMessage(msg) {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), ...msg }])
  }

  function onMessage(tokenOrMsg) {
    setMessages((prev) => {
      const last = prev[prev.length - 1]
      if (!last || last.role !== 'assistant' || last.done) {
        return [...prev, { id: crypto.randomUUID(), role: 'assistant', content: String(tokenOrMsg), sources: [], done: false }]
      } else {
        return [
          ...prev.slice(0, -1),
          { ...last, content: last.content + String(tokenOrMsg) }
        ]
      }
    })
  }

  async function handleSend(e) {
    e?.preventDefault?.()
    if (!input.trim()) return

    const userMsg = { role: 'user', content: input, done: true, ts: Date.now() }
    addMessage(userMsg)
    setInput('')

    setLoading(true)
    try {
      if (channel === 'ws' && wsRef.current?.isOpen()) {
        wsRef.current.send({ type: 'chat', text: userMsg.content })
      } else {
        const res = await sendChat({ text: userMsg.content })
        addMessage({ role: 'assistant', content: res.text, sources: res.sources || [], done: true, ts: Date.now() })
      }
    } catch (err) {
      console.error(err)
      addMessage({ role: 'assistant', content: t('error_generic'), sources: [], done: true, ts: Date.now() })
    } finally {
      setLoading(false)
    }
  }

  async function handleCallClinician() {
    try {
      await sendWhatsApp({ message: t('need_help_msg') })
      alert(t('whatsapp_sent'))
    } catch (e) {
      alert(t('whatsapp_failed'))
    }
  }

  // simple suggestion corpus (no pregnancy entry)
  const SUGGESTIONS = useMemo(() => [
    'I have fever since yesterday',
    'I have cold and cough',
    'I have headache',
    'I have stomach pain',
    'I feel tired and weak',
    'I have diarrhea',
    'I have chest pain',
    'I have skin rash',
    'I have sore throat',
  ], [])

  function updateTypeahead(val) {
    const q = (val || '').toLowerCase().trim()
    if (!q) { setTypeahead([]); return }
    const matches = SUGGESTIONS.filter(s => s.toLowerCase().includes(q)).slice(0, 5)
    setTypeahead(matches)
  }

  const hasUserMessage = useMemo(() => messages.some(m => m.role === 'user'), [messages])

  return (
    <section aria-label={t('chat_with_curebot')} className="grid gap-4 bg-white dark:bg-transparent">
      <div className="max-w-[960px] mx-auto px-4 w-full">
      {!hasUserMessage && (
        <div className="card w-full p-3 flex items-center gap-3 sticky top-0 bg-white z-10 dark:bg-[#1A1B1E] dark:border-[#2E2F33] mb-3">
          <div aria-hidden className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <Logo size={20} />
          </div>
          <div>
            <div className="font-semibold dark:text-white">{t('bot_name')}</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">{t('bot_tagline')}</div>
          </div>
        </div>
      )}
      <ul ref={listRef} className="flex flex-col gap-2" aria-live="polite">
        {messages.map((m, idx) => {
          const prev = messages[idx - 1]
          const next = messages[idx + 1]
          const isUser = m.role === 'user'
          const groupedWithPrev = prev && prev.role === m.role
          const groupedWithNext = next && next.role === m.role
          const showAvatar = !groupedWithPrev
          const showTail = !groupedWithNext
          const radius = isUser
            ? `${groupedWithPrev ? 'rounded-tr-md' : 'rounded-tr-2xl'} ${groupedWithNext ? 'rounded-br-md' : 'rounded-br-2xl'} rounded-tl-2xl rounded-bl-2xl`
            : `${groupedWithPrev ? 'rounded-tl-md' : 'rounded-tl-2xl'} ${groupedWithNext ? 'rounded-bl-md' : 'rounded-bl-2xl'} rounded-tr-2xl rounded-br-2xl`
          return (
            <li key={m.id} className="w-full" style={{animation: 'fadeInUp .18s ease-out'}}>
              <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
                {showAvatar ? (
                  <div aria-hidden className={`w-9 h-9 rounded-full shadow ${isUser ? 'bg-emerald-200 dark:bg-[#232427]' : 'bg-emerald-100 dark:bg-[#232427]'} flex items-center justify-center shrink-0`}>
                    {isUser ? '🧑' : <Logo size={22} />}
                  </div>
                ) : (
                  <div className="w-9 shrink-0" />
                )}
                <div className={`max-w-[68%] ${isUser ? 'self-end text-gray-900 dark:text-white' : 'self-start text-gray-900 dark:text-gray-100'}`}>
                  <div className={`relative ${radius} border ${isUser ? 'bg-white border-[#CFE8D8] dark:bg-[#232427] dark:border-[#2E2F33]' : 'bg-white border-[#CFE8D8] dark:bg-[#232427] dark:border-[#2E2F33]'} px-3 py-1.5` }>
                    {!isUser && showTail && (
                      <svg width="10" height="12" className="absolute -left-2 bottom-2" viewBox="0 0 10 12" fill="none" aria-hidden>
                        <path d="M10 0 L0 6 L10 12" fill="currentColor" className="text-white dark:text-[#232427]"/>
                      </svg>
                    )}
                    {isUser && showTail && (
                      <svg width="10" height="12" className="absolute -right-2 bottom-2" viewBox="0 0 10 12" fill="none" aria-hidden>
                        <path d="M0 0 L10 6 L0 12" fill="currentColor" className="text-white dark:text-[#232427]"/>
                      </svg>
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{m.content}</p>
                  </div>
                  {m.role === 'assistant' && (
                    <div className="mt-2 grid gap-2">
                      <SourcePanel sources={m.sources} />
                    </div>
                  )}
                  {/* timestamp under each message */}
                  <div className={`mt-1 text-[11px] text-gray-500 dark:text-gray-400 ${isUser ? 'text-right' : ''}`}>
                    {new Date(m.ts || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </li>
          )
        })}
        {loading && (
          <li className="w-full" aria-live="assertive">
            <div className="flex items-start gap-2.5">
              <div aria-hidden className="w-9 h-9 rounded-full shadow bg-emerald-100 flex items-center justify-center shrink-0">
                <Logo size={22} />
              </div>
              <div className="max-w-[68%] self-start text-gray-900">
                <div className="relative rounded-2xl border bg-white border-[#CFE8D8] dark:bg-[#232427] dark:border-[#2E2F33] dark:text-gray-100 px-3 py-1.5">
                  <svg width="10" height="12" className="absolute -left-2 top-3" viewBox="0 0 10 12" fill="none" aria-hidden>
                    <path d="M10 0 L0 6 L10 12" fill="currentColor" className="text-white dark:text-[#232427]"/>
                  </svg>
                  <div className="typing-dots flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                    <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                    <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        )}
      </ul>

      {/* static chips removed; type-ahead suggestions appear while typing */}

      {/* attachment chips */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2" aria-label={t('attachments')}>
          {attachments.map(a => (
            <span key={a.id} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 border border-gray-300 text-sm">
              {a.type === 'image' ? '🖼️' : '📎'} {a.name}
              <button type="button" className="icon-btn !w-7 !h-7 !p-0" aria-label={t('remove')} onClick={() => setAttachments(prev => prev.filter(x => x.id !== a.id))}>✕</button>
            </span>
          ))}
        </div>
      )}

      {/* spacer so content isn't hidden behind fixed composer */}
      <div aria-hidden className="h-20" />
      </div>
      <form onSubmit={handleSend} className="fixed bottom-2 left-0 right-0 bg-transparent p-0 m-0 z-30">
        <div className="max-w-[960px] mx-auto px-4">
        <div className="w-full rounded-full bg-white border border-[#CFE8D8] shadow-sm flex items-center gap-2 px-3 py-3 dark:bg-black dark:border-[#2E2F33] dark:text-gray-100">
          {/* attach buttons */}
          <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0]; if (!f) return; const id = crypto.randomUUID();
            const reader = new FileReader(); reader.onload = () => setAttachments(prev => [...prev, { id, name: f.name, type: 'image', dataUrl: reader.result }]); reader.readAsDataURL(f);
            e.target.value = ''
          }} />
          <input ref={fileRef} type="file" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0]; if (!f) return; const id = crypto.randomUUID();
            setAttachments(prev => [...prev, { id, name: f.name, type: 'file' }]);
            e.target.value = ''
          }} />
          <button type="button" className="icon-btn" onClick={() => fileRef.current?.click()} aria-label={`${t('attach')} ${t('file')}`} title={`${t('attach')} ${t('file')}`}>📎</button>

          <label htmlFor="message" className="sr-only">{t('your_message')}</label>
          <textarea
            id="message"
            className="flex-1 px-4 py-2 rounded-full focus:outline-none resize-none dark:text-gray-100 dark:bg-black"
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              const ta = e.target
              ta.style.height = 'auto'
              ta.style.height = Math.min(ta.scrollHeight, 140) + 'px' // up to ~4 lines
              updateTypeahead(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e)
              }
            }}
            placeholder={t('placeholder_health')}
            aria-label={t('your_message')}
          />
          <VoiceButton iconOnly onTranscript={(text) => setInput((prev) => (prev ? prev + ' ' : '') + text)} />
          <button type="submit" className="icon-btn !text-white !border-0 !bg-emerald-600 hover:!bg-emerald-700" aria-label={t('send')} title={t('send')}>➤</button>
        </div>
        {/* type-ahead dropdown */}
        {typeahead.length > 0 && (
          <div className="mt-2 bg-white border border-[#CFE8D8] rounded-xl shadow-sm overflow-hidden dark:bg-[#1A1B1E] dark:border-[#2E2F33]">
            {typeahead.map((s, idx) => (
              <button
                key={idx}
                type="button"
                className="w-full text-left px-4 py-2 hover:bg-white dark:hover:bg-[#232427] dark:text-gray-100"
                onClick={() => { setInput(s); setTypeahead([]) }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        </div>
      </form>
    </section>
  )
}
