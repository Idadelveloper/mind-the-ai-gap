import { useState, useCallback } from "react";
import type { ChatMessage, InferenceSource } from "../types";
import { PERSONA_PROMPT, MOCK_RESPONSE_TEXT, MOCK_IMAGE_RESPONSE_TEXT } from "../constants";
import {
  initModels,
  getTextModel,
  getImageModel,
  fileToGenerativePart,
} from "../firebase";

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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

        // Build the persona-aware prompt
        const fullPrompt = `${PERSONA_PROMPT}\n\nUser question: ${userMessage}`;

        if (imageFile) {
          // ─── Image + text path ──────────────────────────────────────────
          const imageModel = getImageModel();
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
            // 2. Send both text and image to the model:
            //      const result = await imageModel.generateContent([fullPrompt, imagePart]);
            //
            // 3. Extract the response text:
            //      responseText = result.response.text();
            //      source = "in_cloud"; // image model always uses cloud
            //
            // ✏️  Your code goes inside this if-block ↓

          }

          addMessage({ role: "ai", text: responseText, inferenceSource: source });
        } else {
          // ─── Text-only path ─────────────────────────────────────────────
          const textModel = getTextModel();
          let responseText = MOCK_RESPONSE_TEXT;
          let source: InferenceSource = "mock";

          if (textModel) {
            // ============================================================
            // TODO 3: Send the prompt to the model (WORKSHOP.md → Step 3)
            // ============================================================
            //
            // 1. Call the model:
            //      const result = await textModel.generateContent(fullPrompt);
            //
            // 2. Extract the response text:
            //      responseText = result.response.text();
            //
            // 3. Get the inference source (tells you ON_DEVICE vs IN_CLOUD):
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

  return { messages, isLoading, sendMessage };
}
