import { useRef, useEffect } from "react";
import type { ChatMessage } from "../types";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import EmptyState from "./EmptyState";
import "./ChatArea.css";

interface ChatAreaProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSuggestion: (text: string) => void;
}

export default function ChatArea({ messages, isLoading, onSuggestion }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="chat-area">
        <EmptyState onSuggestion={onSuggestion} />
      </div>
    );
  }

  return (
    <div className="chat-area" role="log" aria-live="polite" aria-label="Chat messages">
      <div className="chat-area__spacer" />
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={bottomRef} className="chat-area__bottom" />
    </div>
  );
}
