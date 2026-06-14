# 🍲 The Stranger's Soup
### Agents League 2026 — Reasoning Agents Track | Microsoft Foundry

> *"Everyone's stirring something. Drop yours in. Strangers will hold it with you."*

A real-time anonymous micro-community where strangers hold each other's pain — powered by a multi-step safety reasoning agent built on Microsoft Foundry.

---

## 🎬 Demo Video
📹 [Watch the demo →](https://youtu.be/XOYCgC9Wlxk)

## 🌐 Architecture Diagram
🔗 [Try it yourself →](https://kroki.io/mermaid/svg/eNpdkUGP2jAQhe-V-h_mXnHqvVJCgGYhAZGlPbgcLDIYi-CJPE5WdNP_Xsex6FJLPljzvTeeN8rK9gKv2edP4E8iDowWqEXDINv2CLPZN0hFYsjcb9Qx9KiURjDyhiCZtTJYHydxGuC52OnTFfBGTpOBcyN7spGYByITP6126K2Mi4UsFBbvye_OImx9-ySHXkso9MkS09nBkjpT2_svU8kzujvsUTIZbRQkyhv9mYwWwWiokuVigKX44SvgL1qGlhzMoCCjKEuPT3iWV6-HfZqXqwFWwrc-UTs6c6cUcpjjyweb_8RJuVrst4dqgO8ibeh0xdrjc6tZM1ywaRttEPhCbyYql0GZi8pZaZQP3Pd4ss4D8PIPeBsTY7DILRnGiL0EbP0es4G1NrVB5qdI1tM313mZDbAR-2gBLPvH6iJzKCeqGDOwGJtevWtzj2QRyM302Eyyr49_8QCl2HVN4yM4W7p9GKkM7HbavfUKWfuJre6lw4f7NkA7sUEH2kGBzbizGht0oyNZ7NEe_wLCq9Ki)

## 🌐 Live App
🔗 [Try it yourself →](YOUR_DEPLOYED_URL_HERE)

---

## 🧠 The Problem

At 2am when you're burning out, grieving, or just completely lost — you don't want to explain yourself to someone who knows you. You want to be heard by someone who has nothing to gain from pretending.

Existing mental health apps are either clinical (therapy platforms) or dangerous (unmoderated anonymous boards). There's nothing in between — a warm, safe, ephemeral space where strangers simply hold each other's pain for a moment.

---

## 💡 The Solution

The Stranger's Soup is an ephemeral anonymous confessions platform with a unique social contract:

- **No accounts.** You're assigned a random vegetable name (User Potato, User Carrot...)
- **You must give before you receive.** Read and respond to a stranger's vent before seeing your own responses
- **Everything melts.** Once a confession receives 3 responses, the writer reads them — then releases them forever. Nothing is archived.
- **Safety first.** Every submission passes through a multi-step Foundry reasoning agent before entering the pot

---

## 🤖 The Reasoning Agent — How Foundry Powers This

This is the core of the app. Every single vent and response passes through a multi-step reasoning agent built on Azure OpenAI via Microsoft Foundry.

### Agent 1 — Safety & Empathy Classifier (runs on every vent)

**Step 1: Classify emotional severity**
SAFE → normal emotions, daily stress

DISTURBING → hopelessness, worthlessness, emptiness

DANGEROUS → any mention of suicide, self-harm, or harm to others

**Step 2: Generate personalized intervention**
SAFE → confession enters the pot immediately

DISTURBING → AI generates a warm, specific coping suggestion

based on the exact words the user wrote

DANGEROUS → confession is BLOCKED, never reaches the pot

**Step 3: Route to appropriate crisis resource**
DANGEROUS → user sees crisis message + country-specific helpline

DISTURBING → user sees AI coping suggestion + helpline alongside their post


**Why this matters:** Azure's content filter itself becomes a safety signal. When the filter blocks a request, we catch that error and treat it as `DANGEROUS` — meaning the content filter and our classifier work as a layered safety system, not competing mechanisms.

### Agent 2 — Kindness Enforcer (runs on every response)

**Step 1: Classify response tone**

KIND → supportive, warm, empathetic, neutral/gentle

UNKIND → mocking, dismissive, bullying, deliberately hurtful

**Step 2: If unkind — generate a kinder rewrite**
AI rewrites the harsh message into a warm, supportive version

Pre-fills the user's textarea with the rewrite

User can edit it — they're nudged, not censored


### The Reasoning Pipeline (visual):

User submits vent

↓

[Foundry Agent Step 1] Classify: SAFE / DISTURBING / DANGEROUS

↓

[Foundry Agent Step 2] Generate: coping suggestion OR block message

↓

[Foundry Agent Step 3] Route: appropriate helpline by country

↓

SAFE → enters pot

DISTURBING → enters pot + support shown

DANGEROUS → blocked + crisis resources shown

---

## 🌀 The Core Loop

ARRIVE    → assigned anonymous veggie name, no account needed
FLAVOR    → pick your emotion (Burnout, Grief, Loneliness, Anxiety...)
VENT      → write up to 280 chars — passes through Foundry safety agent
POT       → your vent flies into the boiling pot (animation)
STIR      → spoon stirs — a stranger's vent surfaces from the pot
RESPOND   → write something warm — passes through Foundry kindness agent
WAIT      → when your vent gets 3 responses, it's pulled from the pot
READ      → only YOU can see your responses (writer-only access)
MELT      → click "let it melt" — everything deleted forever


---

## 🏗️ Architecture
┌─────────────────────────────────────────────────────┐

│                   React Frontend                     │

│  Landing → Vent → Stir → MyResponses                │

│  Anonymous sessions via UUID + localStorage          │

└──────────────────┬──────────────────────────────────┘

│ axios HTTP

┌──────────────────▼──────────────────────────────────┐

│              Express / Node.js Backend               │

│                                                      │

│  POST /api/confessions  ←── Safety Agent             │

│  GET  /api/confessions/random                        │

│  POST /api/responses    ←── Kindness Agent           │

│  GET  /api/responses/my/:sessionId                   │

│  DELETE /api/responses/my/:confessionId              │

└──────────┬───────────────────────┬──────────────────┘

│                       │

┌──────────▼──────┐    ┌──────────▼──────────────────┐

│    MongoDB       │    │   Azure OpenAI via Foundry   │

│  (local/Atlas)   │    │                              │

│                  │    │  analyzeVent()               │

│  confessions     │    │  → classify severity         │

│  responses       │    │  → generate coping suggestion│

│                  │    │                              │

│  removedFromPot  │    │  checkKindness()             │

│  responseCount   │    │  → classify tone             │

│  sessionId       │    │  → generate kinder rewrite   │

└──────────────────┘    └─────────────────────────────┘

---

## 🔒 Safety Design Decisions

| Decision | Reasoning |
|----------|-----------|
| Crisis messages are static, not AI-generated | For DANGEROUS classifications, we use carefully-worded, vetted messages — not AI improvisation. Crisis messaging must be consistent and human-reviewed. |
| Content filter errors = DANGEROUS | Azure's own content filter blocking a request IS the signal. We catch this error and treat it as maximum severity — two safety layers working together. |
| Confessions never shown to own author in the pot | Prevents self-reinforcement loops where a user sees their own pain reflected back |
| Responses only visible to confession writer | Protects vulnerable users from seeing their vent discussed publicly |
| Everything deletes after reading | No archive, no screenshots possible via the app, no permanent record of vulnerability |

---

## 🎨 The Experience

**Emotion flavors with their own colors and veggies:**
- 🟠 Burnout — warm amber
- 🌸 Heartbreak — dusty rose  
- 💙 Loneliness — cornflower blue
- 💜 Grief — soft lavender
- 🟢 Anxiety — sage green
- 🩶 Lost — warm grey
- *(and 12 more)*

**Animations:**
- Boiling pot with flickering fire, rising steam, floating vegetables
- Vent text flies into the pot on submission
- Spoon stirs when fetching a stranger's vent
- Bubble burst when vent lands in pot
- Fade/dissolve when confession melts

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, React Router |
| Backend | Node.js, Express |
| Database | MongoDB (local dev) / MongoDB Atlas (production) |
| AI / Reasoning | Azure OpenAI via Microsoft Foundry |
| Anonymous sessions | UUID + localStorage (no auth required) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 🚀 Running Locally

**Prerequisites:** Node.js v18+, MongoDB installed locally

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/strangers-soup.git
cd strangers-soup

# Backend
cd server
npm install
# create .env file (see .env.example)
node server.js

# Frontend (new terminal)
cd client
npm install
npm start
```

**`.env.example`:**
MONGO_URI=mongodb://localhost:27017/strangerssoup

PORT=5000

AZURE_FOUNDRY_ENDPOINT=your_azure_foundry_endpoint

AZURE_FOUNDRY_KEY=your_azure_key

AZURE_DEPLOYMENT_NAME=your_deployment_name

---

## 🤖 How Microsoft Foundry Powers the Reasoning

The entire safety and empathy layer is built on Azure OpenAI deployed via Microsoft Foundry. Key patterns used:

**Structured JSON output** — every agent call returns a strict JSON schema, making responses deterministic and parseable:
```js
{ "status": "disturbing", "copingSuggestion": "..." }
{ "tone": "unkind", "rewrite": "..." }
```

**Layered safety** — our classifier + Azure's built-in content filter work as complementary layers, not redundant ones

**Fallback handling** — every agent call has explicit fallback behavior: network errors default to `safe`/`kind`, content filter errors default to `dangerous`/`unkind`

**Conservative classification** — when in doubt, the prompt instructs the model to choose the more serious category

---

## 📊 Rubric Alignment

| Criterion | Weight | How We Deliver |
|-----------|--------|----------------|
| **Accuracy & Relevance** | 20% | Full working anonymous confessions loop. Multi-step reasoning agent built on Microsoft Foundry. Meets Reasoning Agents track requirements. |
| **Reasoning & Multi-step Thinking** | 20% | 3-step safety pipeline (classify → personalize → route). Separate kindness agent with classify + rewrite. Content filter errors as safety signals. Each step feeds the next. |
| **Creativity & Originality** | 15% | Ephemeral "melt after reading" mechanic is novel. Veggie anonymity is memorable. "Give before you receive" social contract is unique. AI used for empathy, not just moderation. |
| **User Experience & Presentation** | 15% | Cream/warm aesthetic, flavor-colored emotion chips, animated boiling pot with fire/steam/veggies, flying vent animation, spoon stirs on fetch. |
| **Reliability & Safety** | 20% | Layered content moderation, crisis messages are static/vetted, writer-only response access, ephemeral by design, conservative AI classification policy, explicit error handling on every agent call. |
| **Community Vote** | 10% | Emotionally resonant concept. "I built a soup kitchen for pain" is a shareable idea. Demo video shows real emotional depth. |

---

## 🙏 Acknowledgments

Built for Agents League 2026 — Microsoft AI Skills Fest
Powered by Azure OpenAI via Microsoft Foundry
Anonymous session design inspired by PostSecret
*"Sometimes a stranger holds what a friend cannot."*