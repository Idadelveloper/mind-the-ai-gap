# 🚇 Mind the AI Gap — Workshop Guide

> **GDG London — IWD 2026 x Build with AI**
> *Building Hybrid Experiences with Firebase AI Logic*

---

Welcome! In this workshop you'll build a London Underground AI travel companion
that runs AI **on your user's device** when possible, and automatically switches
to the **cloud** when it isn't.

By the end you'll have an app where:

- **⚡ Text questions** run on Gemini Nano right in the browser — no server, no cost, works offline!
- **☁️ Photo analysis** uses Gemini in the cloud for richer multimodal responses
- **🔄 The SDK routes automatically** between the two based on availability
- **🇬🇧 A grumpy Tube veteran** handles all your Underground queries

This pattern is called **Hybrid Inference**, and it's one of the most powerful
features in Firebase AI Logic.

---

## Prerequisites

- Node.js 18+
- Chrome Desktop (latest) — on-device AI only works on Chrome Desktop
- A Google account (for Firebase — free tier, no billing required)

---

## Getting Started

**1. Clone and install:**

```bash
git clone <repo-url>
cd mind-the-ai-gap
npm install
```

**2. Start the dev server:**

```bash
npm run dev
```

**3. Open http://localhost:5173 in Chrome.**

You should see a beautiful London Underground-themed chat app. Try sending a
message — you'll get a cheeky response from the Tube Veteran telling you to
complete the workshop steps. That's the mock response system working as intended!

**4. Set up Chrome for on-device AI** (do this now so the model downloads in the background):

> **Hardware requirements for Gemini Nano:**
> - **22 GB** free disk space (the model is large)
> - **4 GB+ VRAM** *or* **16 GB RAM** (with 4+ CPU cores)
> - Chrome Desktop (latest) — on-device AI is desktop-only
>
> If your machine doesn't meet these requirements, the app will automatically
> fall back to cloud inference — you'll see ☁️ instead of ⚡, and everything
> still works!

Open these URLs in Chrome and change the flag value as shown:
- `chrome://flags/#optimization-guide-on-device-model` → **Enabled BypassPerfRequirement**
- `chrome://flags/#prompt-api-for-gemini-nano` → **Enabled**

Restart Chrome, then visit `chrome://on-device-internals` and check **Model Status**.
Gemini Nano may take a few minutes to download in the background.

---

## How This App Is Structured

Before diving into the TODOs, here's a quick map:

```
src/
├── firebase.ts         ← Firebase setup + AI model init  (TODOs 1 & 2)
├── hooks/
│   └── useChat.ts      ← Chat logic + AI calls           (TODOs 3 & 4)
├── constants.ts        ← The Tube Veteran's persona prompt
└── components/         ← All UI components (already complete!)
```

You'll only touch **`firebase.ts`** and **`hooks/useChat.ts`**.

---

## Step 1: Create a Firebase Project & Register Your App

### 1a. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** (or **"Create a project"**)
3. Name it `mind-the-ai-gap` (or anything you like)
4. You can **disable Google Analytics** — we don't need it for this workshop
5. Click **Create project** and wait for it to provision

### 1b. Enable Firebase AI Logic

1. In the left sidebar, find the **Build** section and click **AI** → **AI Logic**
2. Click **"Get started"**
3. When asked to choose a provider, select **Gemini Developer API**

   > **Why Gemini Developer API?** It uses your free Gemini API quota — no billing
   > account needed. The alternative (Vertex AI) requires enabling billing.
   > For production apps you might prefer Vertex AI, but for this workshop,
   > Gemini Developer API is perfect.

4. Firebase will create an API key for you. Click **Continue**.

### 1c. Register a Web App

1. Still in the Firebase console, click the **gear icon** ⚙️ next to "Project Overview"
   → **Project settings**
2. Scroll down to **"Your apps"** and click the **Web icon** (`</>`)
3. Give your app a nickname: `Mind the AI Gap Web`
4. **Don't** check "Firebase Hosting" — we're running locally
5. Click **Register app**
6. You'll see a `firebaseConfig` object like this:

   ```js
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "mind-the-ai-gap.firebaseapp.com",
     projectId: "mind-the-ai-gap",
     storageBucket: "mind-the-ai-gap.firebasestorage.app",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef1234567890",
   };
   ```

   **Copy the entire object** — you'll need it in the next step.

7. Click **Continue to console**.

### 1d. Add your config to the app

Open `src/firebase.ts` and find **TODO 1** (it looks like this):

```ts
// ============================================================
// TODO 1: Add your Firebase configuration (WORKSHOP.md → Step 1)
// ============================================================
const firebaseConfig = {
  // apiKey: "...",
  // ...
};
```

Replace the commented-out placeholder with the real values you copied:

```ts
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "mind-the-ai-gap.firebaseapp.com",
  projectId: "mind-the-ai-gap",
  storageBucket: "mind-the-ai-gap.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
};
```

**Save the file.**

### Try it!

Refresh the app. It should still show mock responses — that's expected! The config
connects the app to *your* Firebase project, but we haven't initialized the AI
models yet. That's Step 2.

---

## Step 2: Initialize Firebase AI Logic with Hybrid Inference

This is where the magic happens. We'll create two AI models:

- A **text model** that *prefers* running on your device (Gemini Nano via Chrome)
  and automatically falls back to the cloud when on-device isn't available
- An **image model** that *always* uses the cloud (for richer multimodal capabilities)

### What is Hybrid Inference?

Firebase AI Logic's hybrid inference lets you specify a *preference* for where
inference happens, not a hard requirement. The SDK takes care of routing:

| Mode | Behaviour |
|---|---|
| `PREFER_ON_DEVICE` | Try on-device first, fall back to cloud if unavailable |
| `ONLY_ON_DEVICE` | On-device only — throws an error if unavailable |
| `PREFER_IN_CLOUD` | Try cloud first, fall back to on-device |
| `ONLY_IN_CLOUD` | Cloud only (what you'd use for image analysis) |

For our text model, `PREFER_ON_DEVICE` is ideal: free, private, and offline-capable
when Gemini Nano is available, but always works via the cloud as a safety net.

### Why lazy initialization?

Chrome's on-device AI APIs require a **user gesture** (like clicking a button or
typing in a field) before they can be accessed. That means we can't initialize
the model at page load — we have to wait until the user actually does something.

The app already handles this: `initModels()` is called automatically the first
time someone sends a message. You just need to fill in what it does.

### Add the code

Open `src/firebase.ts` and find **TODO 2**.

**First**, add these imports at the top of the file. Find the existing import line:

```ts
import type { GenerativeModel } from "firebase/ai";
```

Replace it with:

```ts
import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode } from "firebase/ai";
import { PERSONA_PROMPT } from "./constants";
```

**Then**, find the `initModels()` function body and add your initialization code:

```ts
export function initModels(): void {
  if (_textModel || _imageModel) return;

  // ✏️  Add this code:
  const ai = getAI(app, { backend: new GoogleAIBackend() });

  // Text model: prefers on-device, falls back to cloud automatically.
  // We use startChat() on this model in useChat.ts so the SDK manages
  // conversation history across messages in the same session.
  // ⚠️  systemInstruction must be set here in inCloudParams — the SDK
  //     correctly normalises it at this level (not inside startChat()).
  _textModel = getGenerativeModel(ai, {
    mode: InferenceMode.PREFER_ON_DEVICE,
    inCloudParams: {
      model: "gemini-2.5-flash-lite",
      systemInstruction: PERSONA_PROMPT,
    },
  });

  // Image model: always uses cloud (on-device has limited multimodal support).
  // Used as a one-shot generateContent() call in useChat.ts.
  _imageModel = getGenerativeModel(ai, {
    mode: InferenceMode.ONLY_IN_CLOUD,
    inCloudParams: {
      model: "gemini-2.5-flash",
      systemInstruction: PERSONA_PROMPT,
    },
  });
}
```

**Save the file.**

### What each line does

- `getAI(app, { backend: new GoogleAIBackend() })` — creates an AI service
  instance connected to your Firebase project, using the Gemini Developer API backend

- `getGenerativeModel(ai, { mode: InferenceMode.PREFER_ON_DEVICE, inCloudParams: {...} })` —
  creates a model that prefers Chrome's built-in Gemini Nano, with `gemini-2.5-flash-lite`
  as the cloud fallback

- `systemInstruction: PERSONA_PROMPT` — gives the model its persona. Setting it
  here (in `inCloudParams`) is important: the SDK normalises the string to the
  correct API format at this level. Passing it to `startChat()` instead causes
  a 400 error — see the note in Step 3.

- `inCloudParams: { model: "gemini-2.5-flash" }` — the image model uses Gemini 2.5
  Flash for fast, high-quality multimodal responses (full cloud inference)

### Try it!

Refresh the app and send a message. It still shows mock responses — that's because
the models are initialized now, but the code that *calls* them hasn't been written
yet. The `if (textModel)` block in `useChat.ts` is empty. Let's fix that in Step 3!

---

## Step 3: Wire Up Text Chat with the Firebase Chat API

Now let's connect the text model to the chat. We'll use Firebase AI Logic's
**chat API** — `startChat()` and `sendMessage()` — which automatically manages
the conversation history for you, so you don't have to track it yourself.

### The chat API vs. generateContent()

| | `generateContent()` | `startChat()` + `sendMessage()` |
|---|---|---|
| Memory | None — each call is standalone | SDK tracks history automatically |
| Best for | One-shot queries, on-device | Multi-turn conversation |
| History | You manage it yourself | Built in |

For our chat app, `startChat()` is the right tool. Each call to `sendMessage()`
adds the message and response to the session's history, so the AI actually
remembers what you said earlier in the conversation.

### Open `src/hooks/useChat.ts`

Find **TODO 3**. It's inside the text-only path of `sendMessage()`:

```ts
const textModel = getTextModel();
let responseText = MOCK_RESPONSE_TEXT;
let source: InferenceSource = "mock";

if (textModel) {
  // ============================================================
  // TODO 3: Send the message using the chat API (WORKSHOP.md → Step 3)
  // ============================================================
  //
  // ✏️  Your code goes inside this if-block ↓

}
```

Add this code inside the `if (textModel)` block:

```ts
if (textModel) {
  // Create a session on the first message; reuse it for follow-ups.
  // The persona comes from systemInstruction set on the model in firebase.ts.
  if (!chatSessionRef.current) {
    chatSessionRef.current = textModel.startChat();
  }

  // The SDK automatically appends this message + response to the history
  const result = await chatSessionRef.current.sendMessage(userMessage);

  responseText = result.response.text();
  source = result.response.inferenceSource ?? "in_cloud";
}
```

**Save the file.**

### What each part does

- `textModel.startChat()` — creates a `ChatSession` with no extra params. The
  Tube Veteran's persona is already baked into the model via `systemInstruction`
  in `firebase.ts` — no need to repeat it here.

- `chatSessionRef.current` — a React ref that holds the session across renders
  without causing re-renders itself. It persists for the full conversation.

- `chatSessionRef.current.sendMessage(userMessage)` — sends your message.
  The SDK automatically includes the full conversation history in the request,
  so the Tube Veteran remembers what you said before.

- `result.response.inferenceSource` — tells you whether inference happened
  `"on_device"` (⚡) or `"in_cloud"` (☁️). The UI chip updates automatically.

> **Why not pass `systemInstruction` to `startChat()`?**
> The Firebase AI SDK normalises a plain string to the correct `Content` API
> format when you pass it to `getGenerativeModel()`. It does *not* do this
> normalisation inside `startChat()`, so the raw string gets sent to the API
> and you get a 400 error. Always set `systemInstruction` at the model level.

> **Note on on-device + multi-turn:** When Gemini Nano handles the first
> message, it works great. For follow-up messages with conversation history,
> the SDK may route to the cloud — on-device models have limited multi-turn
> support. This is `PREFER_ON_DEVICE` in action: use device when you can,
> cloud when you can't.

### Try it!

Send a message. You should get a real response from the Tube Veteran! Now send
a follow-up that references your first message — the AI should remember the
context. That's the chat session working.

Check the chip on each response:
- **⚡ On-Device** — Gemini Nano ran on your machine, no network request!
- **☁️ Cloud** — Firebase routed to Gemini in the cloud

### 🧪 Experiment: Test offline mode

1. Open **DevTools** (F12) → **Network** tab
2. Check the **"Offline"** checkbox to simulate no internet connection
3. Send a message

If Gemini Nano is available and this is your first message (no history),
you should **still get a response** — even offline! That's hybrid inference.
The ⚡ chip confirms it. Follow-up messages with history will show an error
offline (cloud is needed for multi-turn), which re-enables when you go back online.

---

## Step 4: Add Photo Analysis with Cloud AI

Text is sorted — now let's add image analysis. The cloud Gemini model can look
at a photo and give intelligent responses. Perfect for analysing Tube maps, station
boards, or any other image a traveller might encounter.

### Why use the cloud for images?

On-device Gemini Nano has limited multimodal support (it's optimised for text).
For reliable image analysis, we use `ONLY_IN_CLOUD` mode — no fallback, always
the full Gemini model.

### Open `src/hooks/useChat.ts`

Find **TODO 4**. It's in the image path of `sendMessage()`, above TODO 3:

```ts
const imageModel = getImageModel();
let responseText = MOCK_IMAGE_RESPONSE_TEXT;
let source: InferenceSource = "mock";

if (imageModel) {
  // ============================================================
  // TODO 4: Send image + text to the cloud model (WORKSHOP.md → Step 4)
  // ============================================================
  //
  // ✏️  Your code goes inside this if-block ↓

}
```

Add these three lines inside the `if (imageModel)` block:

```ts
if (imageModel) {
  const imagePart = await fileToGenerativePart(imageFile);
  const result = await imageModel.generateContent([userMessage, imagePart]);
  responseText = result.response.text();
  source = "in_cloud";
}
```

**Save the file.**

### What's happening here

- `fileToGenerativePart(imageFile)` — converts the uploaded `File` into the
  `inlineData` format that the Firebase AI SDK expects (base64-encoded bytes
  + MIME type). This helper is already written in `firebase.ts`.

- `imageModel.generateContent([fullPrompt, imagePart])` — sends an array with
  both the text prompt and the image. The model receives both and responds in
  character as the Tube Veteran.

- `source = "in_cloud"` — we hardcode this because the image model always uses
  the cloud (`ONLY_IN_CLOUD` mode).

### Try it!

Click the **camera icon** in the input bar and upload a photo.

Try uploading:
- A photo of a Tube map or station sign
- A picture of something in London
- Any image at all — the Tube Veteran will respond in character regardless!

You should see the **☁️ Cloud** chip on the response — confirming it used the
cloud Gemini model.

---

## You Did It! 🎉

You've built a fully working hybrid AI app with:

- ✅ **On-device AI** — text responses via Gemini Nano, private and offline-capable
- ✅ **Automatic cloud fallback** — seamlessly switches when on-device isn't available
- ✅ **Multi-turn conversation** — the Firebase chat API manages history for you
- ✅ **Cloud AI for images** — Gemini 2.5 Flash handles multimodal analysis
- ✅ **Zero backend** — Firebase AI Logic handles API key security and routing
- ✅ **Real-time inference source indicator** — see exactly where each response came from

### What's happening under the hood?

```
User sends a text message
        │
        ▼
  initModels() called
  (lazy — first interaction only)
        │
        ▼
  chatSession.sendMessage(userMessage)
  [ChatSession tracks history automatically]
        │
        ├─── Chrome has Gemini Nano? ──► On-device inference ──► ⚡ On-Device chip
        │    (single-turn or no history)   (no network request!)
        └─── History / not available? ──► Firebase cloud proxy ──► ☁️ Cloud chip
                                          (gemini-2.5-flash-lite)
```

For images, the path is always cloud:
```
imageModel.generateContent([prompt, imagePart])
        │
        └──────────────────────────────► Firebase cloud proxy ──► ☁️ Cloud chip
                                         (gemini-2.5-flash)
```

The Firebase proxy handles your API key, rate limiting, and App Check verification.
Your key is never exposed in the browser.

---

## Bonus Challenges

Got some time left? Try these:

### Easy
- [ ] Modify `PERSONA_PROMPT` in `constants.ts` — make the Tube Veteran even
      grumpier, or change their personality entirely
- [ ] Try `InferenceMode.ONLY_ON_DEVICE` for the text model — what happens when
      you're online? What about offline?
- [ ] Try `InferenceMode.PREFER_IN_CLOUD` — compare the latency and response
      quality vs `PREFER_ON_DEVICE`

### Medium
- [ ] **Add streaming** — replace `generateContent()` with `generateContentStream()`
      for a typewriter effect. Hint: iterate over `result.stream` and update the
      message text incrementally
- [ ] **Swap the inference mode** — try `InferenceMode.ONLY_ON_DEVICE` and then
      `InferenceMode.PREFER_IN_CLOUD` for the text model. How does latency and
      response quality compare?

### Hard
- [ ] **Enable App Check** — adds an extra layer of security to prevent API abuse.
      See: [Firebase App Check docs](https://firebase.google.com/docs/app-check)
- [ ] **Deploy to Firebase Hosting** — run `npx firebase init hosting` then
      `npm run build && npx firebase deploy`
- [ ] **Add a second AI feature** — what about a route planner that uses
      structured output (`responseSchema`) to return step-by-step directions?

---

## Resources

- [Firebase AI Logic — Hybrid Inference (Web)](https://firebase.google.com/docs/ai-logic/hybrid/web/get-started)
- [Firebase AI Logic — Generate Text](https://firebase.google.com/docs/ai-logic/generate-text)
- [Firebase AI Logic — Analyze Images](https://firebase.google.com/docs/ai-logic/analyze-images?_gl=1*1axilpk*_up*MQ..*_ga*MTg2MDU1NzI4Mi4xNzczNDQ3NTEx*_ga_CW55HF8NVT*czE3NzM0NDc1MTEkbzEkZzAkdDE3NzM0NDc1MTEkajYwJGwwJGgw&api=dev)
- [Chrome Built-in AI — Getting Started](https://developer.chrome.com/docs/ai/get-started)
- [Gemini API — Model Overview](https://ai.google.dev/gemini-api/docs/models)
- [Firebase AI Logic SDK Reference](https://firebase.google.com/docs/reference/js/ai)

---

*Built for GDG London — IWD 2026 x Build with AI* 🇬🇧
