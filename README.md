# NaviBuddy — AI-Powered Employee Onboarding Assistant

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0--MVP-4F46E5?style=flat-square" alt="Version" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/Vanilla%20JS-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JS" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-v3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/No%20Framework-Zero%20Dependencies-F97316?style=flat-square" alt="Zero Deps" />
</p>

> **NaviBuddy** is a fully responsive, commercial-grade Single-Page Web Application that serves as an AI-powered virtual onboarding assistant for new employees. It provides instant answers about company policies, SOPs, benefits, and facilities through a conversational chat interface backed by a simulated RAG (Retrieval-Augmented Generation) search engine.

---

## 📸 Overview

NaviBuddy streamlines the Day 1 employee experience by:
- **Answering policy questions instantly** — leave, health benefits, dress code, facilities, HR contacts
- **Citing knowledge base sources** on every response for transparency and trust
- **Proactively checking-in** on employee sentiment at Day 1, Week 1, and Month 1 milestones
- **Escalating complex issues** to HR with a pre-drafted email template
- **Allowing HR Admins** to upload and activate new policy documents without a deployment

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Markup** | HTML5 (semantic, ARIA-accessible) |
| **Styling** | Tailwind CSS v3 (CDN) + Custom CSS3 |
| **Logic** | Vanilla JavaScript ES6+ (Strict Mode) |
| **Icons** | Lucide Icons (CDN UMD build) |
| **Typography** | Google Fonts — Inter |
| **Persistence** | Browser `localStorage` API |
| **Build Tools** | None — zero build step required |

---

## 🏗 Architecture Breakdown

The application is organized into **4 modular namespace objects** within `script.js`, each with a single clear responsibility:

```
NaviBuddyApp (Orchestrator)
├── StorageManager   — localStorage read/write abstraction
├── RAGEngine        — Simulated retrieval & answer generation
└── UIManager        — DOM rendering, event delegation, modal control
```

### `StorageManager`
A self-contained IIFE that wraps all `localStorage` operations behind a clean API. All keys are versioned (`_v2`) to allow future schema migrations without corrupting existing sessions.

```
StorageManager.saveChat(messages)
StorageManager.loadChat()
StorageManager.saveMilestone(id)
StorageManager.loadCustomDocs()
StorageManager.clearAll()
```

### `RAGEngine`
Simulates the Retrieval-Augmented Generation pipeline in three stages:

1. **Tokenization** — Query string is lowercased, punctuation-stripped, and split into tokens.
2. **Scoring** — Each knowledge base document is scored against the token set using keyword hit-rate weighting (title/keyword hits weighted higher than full-content hits).
3. **Answer Generation** — Top-k documents are assembled into a natural-language response with a category-appropriate introduction sentence.

If `confidence < 0.15`, the engine returns a `null` answer and sets the escalation flag, triggering the HR handoff card in the UI.

```
RAGEngine.init(baseDocs, customDocs)
RAGEngine.search(query, topK)          → [{ doc, score }]
RAGEngine.generateAnswer(query, results) → { answer, confidence, sources }
RAGEngine.addDocument(doc)
```

### `UIManager`
All DOM manipulation is centralized here. Key principles:
- **DOM Cache on init** — All frequently accessed elements are cached in `el{}` once at startup, avoiding repeated `querySelector` calls.
- **XSS Sanitization** — User-submitted text is always passed through `_sanitizeText()` which renders via `createTextNode` → escaped innerHTML. It is **never** injected raw into the DOM.
- **Bot content rendering** — Knowledge base content (trusted source) is rendered via `_renderBotContent()` which only permits `<br>` and emoji spans, no arbitrary HTML.
- **Event Delegation** — Chip clicks, sidebar link clicks, chat feed interactions (escalation, source badges, check-in buttons) are all handled via single delegated listeners on their container elements.

### `NaviBuddyApp`
The main orchestrator that:
- Bootstraps all modules on `DOMContentLoaded`
- Restores persisted state from `localStorage`
- Wires all event listeners via `_bindEvents()`
- Controls the async query processing flow (typing indicator → RAG search → response render)
- Manages milestone switching and check-in trigger logic

---

## 📁 File Structure

```
navibuddy/
├── index.html     # Semantic SPA shell, Tailwind + Lucide CDN, full layout
├── style.css      # CSS custom properties, keyframe animations, component styles
├── script.js      # Modular JS: StorageManager, RAGEngine, UIManager, NaviBuddyApp
└── README.md      # This file
```

---

## 🚀 Getting Started

### Option A — Direct Browser Open (Fastest)

```bash
# No server required — simply open in your browser
open index.html      # macOS
start index.html     # Windows
xdg-open index.html  # Linux
```

> **Note:** `localStorage` and Clipboard API work normally with `file://` protocol on all modern browsers.

### Option B — VS Code Live Server

1. Install the **Live Server** extension in VS Code.
2. Right-click `index.html` → **Open with Live Server**.
3. App launches at `http://127.0.0.1:5500`.

### Option C — Any Static HTTP Server

```bash
# Python 3
python -m http.server 3000

# Node.js (npx)
npx serve .

# PHP
php -S localhost:3000
```

Then navigate to `http://localhost:3000`.

---

## ✨ Feature Walkthrough

### 1. Chat Interface
- Type any question in the input bar and press **Enter** to send.
- Use **Shift+Enter** to insert a new line without submitting.
- NaviBuddy responds with a smooth **typing indicator** (animated dots) before each reply.

### 2. Quick Suggestion Chips
Clickable pill buttons above the input pre-fill common questions:
- 💊 Cara Klaim Reimburse
- 👔 Aturan Berpakaian
- ☕ Lokasi Pantry & Fasilitas
- 👥 Struktur Tim HR

### 3. Knowledge Base & Source Citations
Every answer sourced from the knowledge base displays a **📄 Source badge** citing the exact document. Click any badge to see the full document title in a toast notification.

### 4. Onboarding Milestones
Switch between three onboarding phases via the top navigation tabs:
| Tab | Phase | Check-in Theme |
|---|---|---|
| 🌅 Hari 1 | Day 1 — Welcome | First impressions |
| ⭐ Minggu 1 | Week 1 — First Impression | Early experience |
| 🚀 Bulan 1 | Month 1 — Pulse Check | 30-day sentiment |

Switching phases triggers a **proactive check-in card** with multiple-choice response buttons.

### 5. Smart Escalation
When NaviBuddy's confidence is too low to answer reliably, it shows an orange **Escalation Card** with a button to generate a pre-filled HR email draft. The draft includes the issue summary and recent chat history.

### 6. HR Admin Upload
Click the **database icon** in the header to open the Admin Upload modal. HR administrators can paste new policies (title, category, keywords, content) which are immediately added to the active knowledge base and persisted to `localStorage`.

### 7. Reset Session
Click the **trash icon** in the header to clear all chat history, custom documents, and milestone progress, starting a fresh onboarding session.

---

## 🎨 Design System

```
Color Palette:
  Brand Primary:  #4F46E5 (Deep Indigo)
  Brand Dark:     #3730A3
  Brand Light:    #818CF8
  Accent CTA:     #F97316 (Vibrant Orange) — used for Send button, escalation alerts
  Accent Dark:    #EA580C
  Canvas BG:      #F8FAFC (Off-white)
  Surface:        #FFFFFF
  Border:         #E2E8F0

Typography:   Inter (Google Fonts), 14–15px base, 1.6 line-height
Radius:       sm=6px, md=12px, lg=16px, xl=20px, 2xl=24px
Shadow:       sm → xl (0–40px spread, low opacity)
Transitions:  all 0.18s ease (standard), 0.25s (modals/sidebar)
```

---

## 🔒 Security Notes

| Concern | Implementation |
|---|---|
| XSS Prevention | All user text rendered via `document.createTextNode` → escaped HTML, never raw `innerHTML` |
| Bot content | Only `<br>` and pre-approved emoji `<span>` permitted via `_renderBotContent()` |
| Admin input | Title and content escaped before any DOM insertion |
| No eval() | Zero use of `eval()`, `Function()`, or dynamic script injection |
| LocalStorage | Only serialized JSON primitives stored; parsed with try/catch |

---

## 📖 Git Commit Guidelines

This project follows **Conventional Commits** specification:

```
<type>(<scope>): <short description>

[optional body]
[optional footer]
```

### Types

| Type | When to Use |
|---|---|
| `feat:` | A new feature or capability |
| `fix:` | A bug fix |
| `docs:` | Documentation changes only |
| `style:` | CSS/formatting changes, no logic change |
| `refactor:` | Code restructure without feature/fix |
| `perf:` | Performance improvements |
| `chore:` | Dependency updates, build scripts, tooling |
| `test:` | Adding or updating tests |

### Examples

```bash
git commit -m "feat(rag): add semantic keyword scoring to RAGEngine"
git commit -m "fix(ui): prevent XSS in admin document title field"
git commit -m "feat(checkin): add Month 1 pulse check milestone trigger"
git commit -m "style(chat): improve message bubble border radius on mobile"
git commit -m "refactor(storage): version localStorage keys to _v2 schema"
git commit -m "docs(readme): add architecture breakdown section"
git commit -m "fix(modal): close on Escape key and backdrop click"
git commit -m "perf(dom): cache all UI elements in UIManager.el on init"
```

---

## 🗺 Roadmap (Post-MVP)

- [ ] Real LLM integration via OpenAI / watsonx.ai API
- [ ] PDF/DOCX document parsing for automated KB ingestion
- [ ] Multi-language support (ID/EN toggle)
- [ ] HR Dashboard analytics panel (query trends, escalation rates)
- [ ] Slack / Teams bot integration via webhook
- [ ] Role-based access control (employee vs. HR admin views)
- [ ] PWA manifest + offline support via Service Worker

---

## 📄 License

MIT © 2026 NaviBuddy Project. Built with ❤️ using zero framework dependencies.

---

<p align="center">
  <strong>NaviBuddy</strong> — Because great onboarding starts with a great first conversation.
</p>
#   I B M _ S K I L L S B U I L D  
 