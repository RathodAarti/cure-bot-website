// Mock-only build: fully stub Supabase so no external package is required.
export async function getSupabase() { return null }

export async function saveMessageSupabase(_msg) { return { ok: false, reason: 'not_configured' } }
