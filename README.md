# 🚇 Mind the AI Gap

A London Underground AI travel companion built with React, Vite, and Firebase AI Logic.
Demonstrates **hybrid inference** — on-device Gemini Nano with automatic cloud fallback.

**Built for GDG London — IWD 2026 x Build with AI**
**Workshop: "Building Hybrid Experiences with Firebase AI Logic"**

---

## Quick Start

```bash
git clone <repo-url>
cd mind-the-ai-gap
npm install
npm run dev
```

Open **http://localhost:5173** in Chrome. You'll see the app with mock responses.
Then follow **[WORKSHOP.md](./WORKSHOP.md)** to build the real AI features!

---

## Prerequisites

- **Node.js 18+**
- **Chrome Desktop** (latest) — on-device AI only works on Chrome Desktop
- **A Google account** — for Firebase (free tier, no billing required)

---

## Chrome Setup for On-Device AI

For local development, enable these flags in Chrome:

1. Open `chrome://flags/#optimization-guide-on-device-model`
   → Set to **Enabled BypassPerfRequirement**

2. Open `chrome://flags/#prompt-api-for-gemini-nano-multimodal-input`
   → Set to **Enabled**

3. **Restart Chrome**

4. Verify the model is downloaded:
   → Open `chrome://on-device-internals` → check **Model Status**

> **Note:** The model download may take a few minutes on first use.
> For production apps, use the [Chrome Origin Trial](https://developer.chrome.com/origintrials/#/view_trial/2533837740349325313) instead of flags.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 18 + TypeScript |
| Build | Vite |
| AI | Firebase AI Logic (Gemini) |
| Icons | lucide-react |
| Markdown | react-markdown |
| Styling | Plain CSS with custom properties |

---

## Workshop Guide

👉 **[Open WORKSHOP.md](./WORKSHOP.md)** for the full step-by-step tutorial.

The guide walks you through 4 steps to turn this UI shell into a fully working
hybrid AI app — no backend required.
