import { useState, useCallback, useEffect, useRef } from "react";
import type { ChatSession } from "firebase/ai";
import type { ChatMessage, InferenceSource } from "../types";
import { PERSONA_PROMPT, MOCK_RESPONSE_TEXT, MOCK_IMAGE_RESPONSE_TEXT } from "../constants";
import {
  initModels,
  getTextModel,
  getImageModel,
  fileToGenerativePart,
} from "../firebase";

// ─── persistence ────────────────────────────────────────────────────────────

const STORAGE_KEY = "mtag-messages";

function loadMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

// ─── helpers ────────────────────────────────────────────────────────────────

const makeId = () => crypto.randomUUID();

/** Reads a File as a base64 data URL (used to display the image in the chat). */
const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// ─── hook ───────────────────────────────────────────────────────────────────

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages);
  const [isLoading, setIsLoading] = useState(false);

  // The chat session persists across messages in the same conversation.
  // We use a ref so it doesn't trigger re-renders when it changes.
  // It is reset to null when the user starts a new chat.
  const chatSessionRef = useRef<ChatSession | null>(null);

  // Persist messages to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const addMessage = useCallback(
    (msg: Omit<ChatMessage, "id" | "timestamp">) => {
      setMessages((prev) => [
        ...prev,
        { ...msg, id: makeId(), timestamp: Date.now() },
      ]);
    },
    []
  );

  const sendMessage = useCallback(
    async (userMessage: string, imageFile?: File) => {
      if (!userMessage.trim() && !imageFile) return;

      // Add the user's message to the chat immediately
      const imageDataUrl = imageFile ? await fileToDataUrl(imageFile) : undefined;
      addMessage({
        role: "user",
        text: userMessage.trim(),
        image: imageDataUrl,
      });

      setIsLoading(true);

      try {
        // Lazy-initialize models on first user interaction (Chrome requirement)
        initModels();

        if (imageFile) {
          // ─── Image + text path (standalone cloud call) ──────────────────
          // Images use a one-shot generateContent() call rather than a chat
          // session — the persona is included directly in the prompt.
          const imageModel = getImageModel();
          const fullPrompt = `${PERSONA_PROMPT}\n\nUser question: ${userMessage}`;
          let responseText = MOCK_IMAGE_RESPONSE_TEXT;
          let source: InferenceSource = "mock";

          if (imageModel) {
            // ============================================================
            // TODO 4: Send image + text to the cloud model (WORKSHOP.md → Step 4)
            // ============================================================
            //
            // 1. Convert the image file:
            //      const imagePart = await fileToGenerativePart(imageFile);
            //
            // 2. Send text and image together:
            //      const result = await imageModel.generateContent([fullPrompt, imagePart]);
            //
            // 3. Extract the response:
            //      responseText = result.response.text();
            //      source = "in_cloud"; // image model always uses cloud
            //
            // ✏️  Your code goes inside this if-block ↓

          }

          addMessage({ role: "ai", text: responseText, inferenceSource: source });
        } else {
          // ─── Text chat path (multi-turn via Firebase AI chat API) ────────
          // startChat() creates a ChatSession that automatically manages
          // conversation history — no need to track it yourself.
          const textModel = getTextModel();
          let responseText = MOCK_RESPONSE_TEXT;
          let source: InferenceSource = "mock";

          if (textModel) {
            // ============================================================
            // TODO 3: Send the message using the chat API (WORKSHOP.md → Step 3)
            // ============================================================
            //
            // 1. Create a chat session (only on the first message of a conversation):
            //      if (!chatSessionRef.current) {
            //        chatSessionRef.current = textModel.startChat({
            //          systemInstruction: PERSONA_PROMPT,
            //        });
            //      }
            //
            // 2. Send the message — the SDK automatically tracks history:
            //      const result = await chatSessionRef.current.sendMessage(userMessage);
            //
            // 3. Extract the response and inference source:
            //      responseText = result.response.text();
            //      source = result.response.inferenceSource ?? "in_cloud";
            //
            // ✏️  Your code goes inside this if-block ↓

          }

          addMessage({ role: "ai", text: responseText, inferenceSource: source });
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        addMessage({
          role: "ai",
          text: `Blimey, something's gone pear-shaped: ${message}\n\nHave a check of the browser console for more details, would ya.`,
          isError: true,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [addMessage]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    chatSessionRef.current = null; // Reset the chat session for the next conversation
  }, []);

  return { messages, isLoading, sendMessage, clearMessages };
}
