import React, { useEffect, useRef, useState } from 'react'
import { sendVoice } from '../adapters/proxy.js'
import { useTranslation } from 'react-i18next'

const hasWebSpeech = typeof window !== 'undefined' && (
  window.SpeechRecognition || window.webkitSpeechRecognition
)

export default function VoiceButton({ onTranscript, iconOnly = false }) {
  const { t } = useTranslation()
  const recRef = useRef(null)
  const [recording, setRecording] = useState(false)

  useEffect(() => {
    if (!hasWebSpeech) return
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SR()
    rec.lang = 'en-US'
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.onresult = (e) => {
      const text = Array.from(e.results).map(r => r[0].transcript).join(' ')
      onTranscript?.(text)
    }
    rec.onend = () => setRecording(false)
    recRef.current = rec
  }, [])

  async function handlePress() {
    if (recRef.current) {
      if (!recording) { setRecording(true); recRef.current.start() }
      else { recRef.current.stop(); setRecording(false) }
      return
    }
    // Fallback: call backend to process voice (requires UI to capture audio; omitted for bundle size)
    try {
      const res = await sendVoice({})
      if (res?.text) onTranscript(res.text)
    } catch (e) {
      console.warn('voice unavailable')
    }
  }

  if (iconOnly) {
    return (
      <button
        type="button"
        className={`icon-btn ${recording ? '!bg-rose-50 !border-rose-300' : ''}`}
        onClick={handlePress}
        aria-pressed={recording}
        aria-label={t('voice_input')}
        title={t('voice_input')}
      >
        🎤
      </button>
    )
  }
  return (
    <button
      type="button"
      className={`btn ${recording ? '!bg-rose-600' : ''}`}
      onClick={handlePress}
      aria-pressed={recording}
      aria-label={t('voice_input')}
    >
      {recording ? t('stop') : t('voice')}
    </button>
  )
}
