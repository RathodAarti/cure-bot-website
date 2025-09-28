import React from 'react'

// Friendly robot logo designed for approachability and legibility.
// Large eyes, soft rounded head, gentle smile. Works on dark/gray UIs.
export default function Logo({ size = 24 }) {
  const s = typeof size === 'number' ? size : 24
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" role="img" aria-label="CureBot logo">
      <defs>
        <linearGradient id="cb_body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A7F3D0"/>
          <stop offset="100%" stopColor="#10B981"/>
        </linearGradient>
        <linearGradient id="cb_bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EAF7F0"/>
          <stop offset="100%" stopColor="#FFFFFF"/>
        </linearGradient>
      </defs>
      {/* soft rounded badge background for contrast on any surface */}
      <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#cb_bg)" stroke="#CFE8D8"/>
      {/* antenna */}
      <circle cx="32" cy="10" r="3" fill="#10B981" />
      <rect x="31" y="12" width="2" height="6" rx="1" fill="#10B981" />
      {/* head */}
      <rect x="16" y="22" width="32" height="24" rx="10" fill="url(#cb_body)" />
      {/* face plate */}
      <rect x="19" y="26" width="26" height="16" rx="8" fill="#ffffff" opacity="0.92" />
      {/* eyes */}
      <circle cx="28" cy="34" r="3" fill="#111827" />
      <circle cx="36" cy="34" r="3" fill="#111827" />
      {/* smile */}
      <path d="M26 38c2.2 2.6 9.8 2.6 12 0" stroke="#10b981" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

