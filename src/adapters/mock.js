import { saveMessage, listMessages, saveFeedback, log } from '../db/local.js'

function delay(ms) { return new Promise(res => setTimeout(res, ms)) }

function pickVariant(variants, previous = '') {
  if (!variants || variants.length === 0) return ''
  const filtered = variants.filter(v => v.trim() !== (previous || '').trim())
  const pool = filtered.length ? filtered : variants
  return pool[Math.floor(Math.random() * pool.length)]
}

export async function sendChat({ text }) {
  // Simulate translation + RAG + verification
  log('gateway.chat', { text })
  const now = Date.now()
  saveMessage({ role: 'user', content: text, ts: now })
  await delay(200)

  const lower = (text || '').toLowerCase().trim()
  const last = listMessages(5).reverse().find(m => m.role === 'assistant')

  const greetWords = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening']
  const isGreeting = greetWords.some(g => lower === g || lower.startsWith(g + ' '))

  const neutralVariants = [
    'I’m here to help. Please describe your symptoms in simple words.',
    'Thanks for reaching out. Tell me what you’re feeling, and I’ll do my best to help.',
    'I’m listening. Share your symptoms in simple language so I can guide you.',
  ]

  let answer = pickVariant(neutralVariants, last?.content)
  let sources = []

  const rules = [
    {
      test: /(fever|feverish|temperature)/,
      reply: [
        'Thanks for sharing. For fever: drink water/ORS, rest, and consider paracetamol 500 mg (adults) if not allergic. Monitor temperature every 6–8 hours. Seek a clinician if it lasts >3 days or is very high or with severe symptoms.'
      ],
      sources: [{ title: 'General fever self-care', snippet: 'Hydration, rest, paracetamol if suitable, temperature monitoring, timely clinician visit if symptoms persist or worsen.' }]
    },
    {
      test: /(headache|migraine)/,
      reply: [
        'For headache: rest in a quiet room, hydrate, and consider paracetamol (adults) if suitable. Seek care if the headache is severe, worst-ever, with fever, stiff neck, confusion, or after head injury.'
      ]
    },
    {
      test: /(stomach\s*pain|abdominal\s*pain|tummy|gastric|stomachache)/,
      reply: [
        'For stomach pain: sip fluids, avoid spicy/oily food, try bland meals (rice, banana, toast). Seek care urgently if pain is severe, persistent, with vomiting blood, black stools, or fever.'
      ]
    },
    {
      test: /(tired|weak|fatigue|fatigued|exhausted)/,
      reply: [
        'Feeling tired/weak: rest, hydrate, and eat balanced meals. If weakness is sudden, severe, with chest pain, breathlessness, fainting, or one-sided weakness, seek urgent care.'
      ]
    },
    {
      test: /(dizzy|dizziness|lightheaded)/,
      reply: [
        'For dizziness: sit or lie down until it passes, hydrate, and rise slowly from bed. If dizziness is severe, with chest pain, fainting, or one-sided weakness, seek urgent care.'
      ]
    },
    {
      test: /(not\s*eat|did\s*not\s*eat|skipped\s*meal|no\s*food|haven't\s*eaten)/,
      reply: [
        'It may help to eat small, frequent light meals (fruit, toast, porridge) and drink water/ORS. If weakness persists despite eating or you have fainting or chest pain, seek care.'
      ]
    },
    {
      test: /(cold|cough|runny\s*nose)/,
      reply: [
        'For cold/cough: rest, warm fluids, saline gargles/steam inhalation if comfortable. Seek care if high fever, breathlessness, chest pain, or symptoms >10–14 days.'
      ]
    },
    {
      test: /(sore\s*throat)/,
      reply: [
        'For sore throat: warm saline gargles, warm fluids, lozenges (if suitable), and rest. Seek care if high fever, drooling, severe pain, or breathing difficulty.'
      ]
    },
    // Added: vomiting
    {
      test: /(vomit|vomiting|nausea|throwing\s*up)/,
      reply: [
        'For vomiting: take small sips of water/ORS frequently, avoid solid/spicy food for a few hours, try bland food (banana, rice, toast) once better. Seek care urgently if you can’t keep fluids down for >6–8 hours, there is blood in vomit, severe belly pain, very drowsy, or signs of dehydration (dry mouth, very low urine).'
      ]
    },
    // Added: malaria
    {
      test: /(malaria|malarial)/,
      reply: [
        'Malaria symptoms can include fever with chills/sweats, headache, body aches, and fatigue. Seek testing at a clinic as soon as possible—effective treatment requires lab confirmation. Meanwhile, rest, hydrate, and use mosquito protection.'
      ]
    },
    // Added: dengue
    {
      test: /(dengue)/,
      reply: [
        'Dengue symptoms can include high fever, severe headache, pain behind eyes, muscle/joint pain, rash, and nausea. Avoid ibuprofen/aspirin; you may use paracetamol if suitable. Hydrate well and seek medical evaluation—warning signs include bleeding, severe abdominal pain, persistent vomiting, or lethargy.'
      ]
    },
    // Added: injury / first aid
    {
      test: /(injur|wound|cut|bleed)/,
      reply: [
        'First aid: apply gentle pressure with a clean cloth to stop bleeding, clean with running water, and cover with a sterile dressing. For deep/dirty wounds, severe bleeding, suspected fracture, or head injury, seek urgent care. Update tetanus shot if needed.'
      ]
    },
    // Added: dehydration
    {
      test: /(dehydration|dehydrated|very\s*thirsty|dry\s*mouth)/,
      reply: [
        'Signs of dehydration: very thirsty, dry mouth, dark/low urine, dizziness. Take ORS or water frequently, add light meals. Seek care if unable to keep fluids, very little urine for >8 hours, or confusion/drowsiness.'
      ]
    },
    // Added: food poisoning / stomach flu
    {
      test: /(food\s*poison|stomach\s*flu|gastroenteritis)/,
      reply: [
        'For suspected food poisoning/stomach flu: ORS after each loose stool, rest, and bland food (rice, banana, toast). Avoid dairy/oily food. Seek care if high fever, blood in stool, severe pain, or dehydration.'
      ]
    },
    {
      test: /(diarrhea|loose\s*motions)/,
      reply: [
        'For diarrhea: ORS after each loose stool, light meals (rice/banana), and avoid street/unclean food. Seek care if blood in stool, high fever, or dehydration (very thirsty, low urine).'
      ]
    },
    {
      test: /(chest\s*pain|pressure\s*in\s*chest)/,
      reply: [
        'Chest pain can be serious. If pain is severe, crushing, with breathlessness, sweating, or radiating to arm/jaw, seek emergency care immediately.'
      ]
    },
    {
      test: /(pregnan)/,
      reply: [
        'During pregnancy, avoid self‑medication. Eat balanced meals, follow clinician-advised supplements, and attend routine check-ups. Seek urgent care for bleeding, severe pain, or reduced fetal movement.'
      ]
    },
  ]

  if (isGreeting) {
    const helloVariants = [
      'Hello! How can I support you today?',
      'Hi there! How are you feeling? I can help with your symptoms.',
      'Hey! Tell me what’s going on, and I’ll try to help.',
    ]
    answer = pickVariant(helloVariants, last?.content)
  } else {
    const rule = rules.find(r => r.test.test(lower))
    if (rule) {
      answer = rule.reply.length === 1 ? rule.reply[0] : pickVariant(rule.reply, last?.content)
      sources = rule.sources || []
    }
  }

  const res = { text: answer, sources }
  saveMessage({ role: 'assistant', content: answer, sources, done: true, ts: Date.now() })
  log('orchestrator.response', { hasSources: sources.length > 0 })
  return res
}

export async function sendVoice(_) {
  // Return a canned transcript
  await delay(150)
  return { text: 'I feel feverish since yesterday' }
}

export async function sendWhatsApp({ message }) {
  log('notify.whatsapp', { message })
  await delay(100)
  return { ok: true }
}

export async function sendFeedback({ messageId, value }) {
  saveFeedback({ messageId, value })
  await delay(80)
  return { ok: true }
}

export class MockWS {
  constructor({ onMessage } = {}) { this.onMessage = onMessage; this._open = false; this._timer = null }
  connect() { this._open = true }
  isOpen() { return this._open }
  close() { this._open = false; if (this._timer) clearInterval(this._timer) }
  send(obj) {
    if (!this._open) return
    const lower = (obj?.text || '').toLowerCase().trim()
    const greetWords = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening']
    const isGreeting = greetWords.some(g => lower === g || lower.startsWith(g + ' '))
    const ruleVariants = [
      {
        test: /(fever|feverish|temperature)/,
        variants: ['For fever, hydrate, rest, consider paracetamol 500 mg (adults), and seek care if it lasts >3 days or is severe.']
      },
      {
        test: /(headache|migraine)/,
        variants: ['For headache: rest, hydrate, and consider paracetamol (adults) if suitable. Seek care for severe or worst-ever headaches or with warning signs.']
      },
      {
        test: /(stomach\s*pain|abdominal\s*pain|tummy|gastric|stomachache)/,
        variants: ['For stomach pain: sip fluids, eat bland meals, avoid spicy/oily food. Seek care urgently for severe or persistent pain or alarming signs.']
      },
      { test: /(tired|weak|fatigue|exhausted)/, variants: ['Rest, hydrate, and eat balanced meals. Seek care if weakness is severe, sudden, or with chest pain/breathlessness.'] },
      { test: /(dizzy|dizziness|lightheaded)/, variants: ['Sit or lie down, hydrate, and rise slowly. Seek care if severe or with warning signs.'] },
      { test: /(not\s*eat|did\s*not\s*eat|skipped\s*meal|no\s*food|haven't\s*eaten)/, variants: ['Try small frequent light meals and ORS. If weakness persists or you faint, seek care.'] },
      { test: /(cold|cough|runny\s*nose)/, variants: ['For cold/cough: rest, warm fluids, saline gargles/steam. Seek care if severe or prolonged.'] },
      { test: /(sore\s*throat)/, variants: ['For sore throat: warm saline gargles, warm fluids, lozenges if suitable. Seek care for high fever or breathing trouble.'] },
      { test: /(diarrhea|loose\s*motions)/, variants: ['For diarrhea: ORS after each loose stool; light meals. Seek care if blood in stool, high fever, or dehydration.'] },
      { test: /(chest\s*pain|pressure\s*in\s*chest)/, variants: ['Chest pain can be serious. If severe or with breathlessness/sweating, seek emergency care.'] },
      { test: /(pregnan)/, variants: ['During pregnancy avoid self-medication; eat balanced meals and attend check-ups; seek urgent care for bleeding or severe pain.'] },
    ]
    const neutral = [
      'I’m here to help. Please describe your symptoms in simple words.',
      'Thanks for reaching out. Tell me what you’re feeling, and I’ll do my best to help.',
      'I’m listening. Share your symptoms in simple language so I can guide you.'
    ]
    let variants = []
    if (isGreeting) {
      variants = [
        'Hello! How can I support you today?',
        'Hi there! How are you feeling? I can help with your symptoms.',
        'Hey! Tell me what’s going on, and I’ll try to help.'
      ]
    } else {
      const rule = ruleVariants.find(r => r.test.test(lower))
      variants = rule ? rule.variants : neutral
    }
    const response = variants[Math.floor(Math.random() * variants.length)]
    const tokens = response.split(' ')
    let i = 0
    this._timer = setInterval(() => {
      if (i < tokens.length) { this.onMessage?.(tokens[i] + ' '); i++ }
      else { clearInterval(this._timer); this.onMessage?.('\n'); this.onMessage?.(''); }
    }, 120)
  }
}
