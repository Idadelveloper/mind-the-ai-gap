# 🚇 Mind the AI Gap

A London Underground AI travel companion built with React, Vite, and Firebase AI Logic.
Demonstrates **hybrid inference** — on-device Gemini Nano with automatic cloud fallback —
using the Firebase AI Logic **chat API** for multi-turn conversations.

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
Follow **[WORKSHOP.md](./WORKSHOP.md)** to build the real AI features in 4 steps.

---

## How It Works

The app uses Firebase AI Logic's **hybrid inference** and **chat API**:

- **Text chat** — `model.startChat()` creates a `ChatSession`; each `chat.sendMessage()` call automatically tracks conversation history. The session prefers Gemini Nano (on-device, free, offline) and falls back to `gemini-2.5-flash-lite` in the cloud.
- **Photo analysis** — `imageModel.generateContent([text, image])` sends a one-shot multimodal request to `gemini-2.5-flash` in the cloud.
- **Inference chip** — every AI response shows ⚡ On-Device or ☁️ Cloud so you can see exactly where inference happened.
- **Chat history** — messages are persisted to `localStorage` so they survive page refreshes.

---

## Prerequisites

- **Node.js 18+**
- **Chrome Desktop** (latest) — on-device AI only works on Chrome Desktop
- **A Google account** — for Firebase (free tier, no billing required)

---

## Chrome Setup for On-Device AI

For local development, enable these flags in Chrome:

1. `chrome://flags/#optimization-guide-on-device-model` → **Enabled BypassPerfRequirement**
2. `chrome://flags/#prompt-api-for-gemini-nano-multimodal-input` → **Enabled**
3. **Restart Chrome**
4. Check `chrome://on-device-internals` → **Model Status** (download may take a few minutes)

> For production apps, register for the [Chrome Origin Trial](https://developer.chrome.com/origintrials/#/view_trial/2533837740349325313) instead of flags and add the token to `index.html`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React + TypeScript |
| Build | Vite |
| AI (text) | Firebase AI Logic — `ChatSession` with `PREFER_ON_DEVICE` → `gemini-2.5-flash-lite` |
| AI (images) | Firebase AI Logic — `generateContent` with `ONLY_IN_CLOUD` → `gemini-2.5-flash` |
| Icons | lucide-react |
| Markdown | react-markdown |
| Styling | Plain CSS with custom properties |

---

## Project Structure

```
src/
├── firebase.ts          # Firebase init + AI model setup  (TODOs 1 & 2)
├── hooks/
│   ├── useChat.ts       # Chat state, ChatSession, AI calls (TODOs 3 & 4)
│   └── useOnlineStatus.ts
├── components/          # All UI — complete, no changes needed
├── constants.ts         # Persona prompt, suggestion chips
└── types.ts             # ChatMessage, InferenceSource
```

---

## Workshop Guide

👉 **[Open WORKSHOP.md](./WORKSHOP.md)** for the full step-by-step tutorial.

| Step | File | What you build |
|---|---|---|
| 1 | `firebase.ts` | Connect your Firebase project |
| 2 | `firebase.ts` | Initialize hybrid AI models |
| 3 | `hooks/useChat.ts` | Wire up multi-turn chat with `startChat()` + `sendMessage()` |
| 4 | `hooks/useChat.ts` | Add photo analysis with `generateContent()` |
