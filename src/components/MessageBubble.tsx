import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "../types";
import { TUBE_VETERAN_NAME } from "../constants";
import InferenceChip from "./InferenceChip";
import "./MessageBubble.css";

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="message-row message-row--user">
        <div className="bubble bubble--user">
          {message.image && (
            <img
              src={message.image}
              alt="Uploaded"
              className="bubble__image"
            />
          )}
          {message.text && <p className="bubble__text">{message.text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="message-row message-row--ai">
      <div className="bubble-container">
        <div className="bubble-meta">
          <span className="bubble-meta__name">{TUBE_VETERAN_NAME}</span>
          {message.inferenceSource && (
            <InferenceChip source={message.inferenceSource} />
          )}
        </div>
        <div
          className={`bubble bubble--ai ${message.isError ? "bubble--error" : ""}`}
        >
          <ReactMarkdown>{message.text}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
