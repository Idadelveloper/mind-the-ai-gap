// InferenceSource mirrors Firebase AI SDK values ("on_device" | "in_cloud")
// plus "mock" for our workshop placeholder responses
export type InferenceSource = "on_device" | "in_cloud" | "mock";

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: number;
  image?: string; // base64 data URL for display in the chat bubble
  inferenceSource?: InferenceSource;
  isError?: boolean;
}
