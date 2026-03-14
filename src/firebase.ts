import { initializeApp } from "firebase/app";
import type { GenerativeModel } from "firebase/ai";

// ============================================================
// TODO 1: Add your Firebase configuration (WORKSHOP.md → Step 1)
// ============================================================
// Go to: Firebase Console → Project Settings → Your apps → Web app
// Copy your firebaseConfig object and paste the values below.
const firebaseConfig = {
  // apiKey: "AIzaSy...",
  // authDomain: "your-project.firebaseapp.com",
  // projectId: "your-project",
  // storageBucket: "your-project.firebasestorage.app",
  // messagingSenderId: "123456789",
  // appId: "1:123456789:web:abc123def456",
};

// Initialize Firebase (safe to call even before config is filled in)
export const app = initializeApp(firebaseConfig);

// ============================================================
// TODO 2: Initialize Firebase AI Logic with hybrid inference (WORKSHOP.md → Step 2)
// ============================================================
//
// FIRST — add these imports at the top of this file (replace the type import above):
//
//   import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode } from "firebase/ai";
//   import { PERSONA_PROMPT } from "./constants";
//
// THEN — fill in the body of initModels() below:
//
//   const ai = getAI(app, { backend: new GoogleAIBackend() });
//
//   // Text model: prefers on-device, falls back to cloud automatically.
//   // We'll use startChat() on this model in useChat.ts (TODO 3) so the
//   // SDK manages conversation history for us.
//   // systemInstruction must be set here (at model level) — the SDK normalises
//   // it correctly here, but NOT when passed to startChat().
//   _textModel = getGenerativeModel(ai, {
//     mode: InferenceMode.PREFER_ON_DEVICE,
//     inCloudParams: {
//       model: "gemini-2.5-flash-lite",
//       systemInstruction: PERSONA_PROMPT,
//     },
//   });
//
//   // Image model: always uses cloud (on-device has limited multimodal support).
//   // Used as a standalone generateContent() call — no chat session needed.
//   _imageModel = getGenerativeModel(ai, {
//     mode: InferenceMode.ONLY_IN_CLOUD,
//     inCloudParams: {
//       model: "gemini-2.5-flash",
//       systemInstruction: PERSONA_PROMPT,
//     },
//   });
//
// ⚠️  IMPORTANT: getGenerativeModel() must be called AFTER a user interaction.
//     That's why we use lazy initialization (initModels is called on first send).

let _textModel: GenerativeModel | null = null;
let _imageModel: GenerativeModel | null = null;

/**
 * Lazily initializes AI models on first user interaction.
 * Called automatically when a message is sent — you don't need to call this directly.
 *
 * TODO 2: Add your initialization code inside this function.
 */
export function initModels(): void {
  // Guard: don't re-initialize if models are already set
  if (_textModel || _imageModel) return;

  // ✏️  Your TODO 2 code goes here ↓

}

export const getTextModel = (): GenerativeModel | null => _textModel;
export const getImageModel = (): GenerativeModel | null => _imageModel;

// ============================================================
// Utility: Convert a File to the format Firebase AI expects
// (This is already done for you — no changes needed here!)
// ============================================================

/**
 * Converts a File object to an inlineData part for the Firebase AI SDK.
 * Used when sending images to the cloud model.
 */
export async function fileToGenerativePart(
  file: File
): Promise<{ inlineData: { data: string; mimeType: string } }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64Data = dataUrl.split(",")[1];
      resolve({ inlineData: { data: base64Data, mimeType: file.type } });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
