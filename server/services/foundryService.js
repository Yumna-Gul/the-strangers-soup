const { AzureOpenAI } = require('openai')

const client = new AzureOpenAI({
  endpoint: process.env.AZURE_FOUNDRY_ENDPOINT,
  apiKey: process.env.AZURE_FOUNDRY_KEY,
  apiVersion: '2024-05-01-preview'
})

async function analyzeVent(text) {
  try {
    const response = await client.chat.completions.create({
      model: process.env.AZURE_DEPLOYMENT_NAME,
      messages: [
        {
          role: 'system',
          content: `You are a multi-step safety reasoning agent for a mental health support app.

Analyze the text and return ONLY a JSON object with these fields:

1. "status": one of "safe", "disturbing", "dangerous"
   - "safe": normal emotions — sadness, stress, frustration, loneliness, anxiety about daily life
   - "disturbing": hopelessness, worthlessness, emptiness, "I can't do this anymore", "nobody cares"
   - "dangerous": ANY mention of suicide, self-harm, killing, dying, wanting to disappear, hurting others

2. "copingSuggestion": ONLY if status is "disturbing" — write one warm, specific, 1-sentence coping suggestion related to their emotional flavor. Otherwise null.

RULE: If text contains ANY word related to death, killing, or self-harm — ALWAYS return "dangerous", no exceptions.

Return only valid JSON: {"status": "...", "copingSuggestion": "..." or null}
No other text.`
        },
        { role: 'user', content: text }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 150
    })

    const result = JSON.parse(response.choices[0].message.content)
    return result // { status, copingSuggestion }

  } catch (error) {
    console.error('analyzeVent error:', error.message)

    if (error.message.includes('content_filter') || 
        error.message.includes('ResponsibleAIPolicyViolation') ||
        error.code === 'content_filter') {
      return { status: 'dangerous', copingSuggestion: null }
    }

    console.error('⚠️ UNEXPECTED AI ERROR — defaulting to safe:', error)
    return { status: 'safe', copingSuggestion: null }
  }
}

async function checkKindness(text) {
  try {
    const response = await client.chat.completions.create({
      model: process.env.AZURE_DEPLOYMENT_NAME,
      messages: [
        {
          role: 'system',
          content: `You are a tone classifier for a supportive anonymous community app.
Someone is responding to a stranger's emotional vent.

Return ONLY a JSON object with these fields:

1. "tone": "kind" or "unkind"
   - "kind": supportive, warm, empathetic, comforting, encouraging, or neutral/gentle
   - "unkind": ONLY clearly mocking, insulting, bullying, dismissive, or deliberately hurtful

2. "rewrite": ONLY if tone is "unkind" — rewrite their message as a warm, supportive 1-sentence response instead. Otherwise null.

When in doubt, classify as "kind".

Return only: {"tone": "...", "rewrite": "..." or null}
No other text.`
        },
        { role: 'user', content: text }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 100
    })

    const result = JSON.parse(response.choices[0].message.content)
    return result // { tone, rewrite }

  } catch (error) {
    console.error('checkKindness error:', error.message)

    if (error.message.includes('content_filter') || 
        error.message.includes('ResponsibleAIPolicyViolation') ||
        error.code === 'content_filter') {
      return { tone: 'unkind', rewrite: "I'm here for you, and things can get better with time." }
    }

    console.error('⚠️ UNEXPECTED AI ERROR — defaulting to kind:', error)
    return { tone: 'kind', rewrite: null }
  }
}

const HELPLINES = {
  PK: "Umang Pakistan: 0311-7786264 | umangpak.org",
  US: "988 Suicide & Crisis Lifeline (call or text 988)",
  IN: "iCall India: 9152987821",
  GB: "Samaritans UK: 116 123",
  default: "International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/"
}

function getHelpline(countryCode) {
  return HELPLINES[countryCode] || HELPLINES.default
}

module.exports = { analyzeVent, checkKindness, getHelpline }