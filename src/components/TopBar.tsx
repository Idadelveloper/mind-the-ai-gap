import { SquarePen } from "lucide-react";
import "./TopBar.css";

interface TopBarProps {
  isOnline: boolean;
  hasMessages: boolean;
  onNewChat: () => void;
}

export default function TopBar({ isOnline, hasMessages, onNewChat }: TopBarProps) {
  return (
    <header className="topbar" role="banner">
      <div className="topbar__left">
        <img
          src="/mind-the-ai-gap.png"
          alt="Mind the AI Gap"
          className="topbar__logo"
        />
        <div className="topbar__title-group">
          <h1 className="topbar__title">Mind the AI Gap</h1>
          <p className="topbar__subtitle">London Underground AI Companion</p>
        </div>
      </div>

      <div className="topbar__right">
        {hasMessages && (
          <button
            className="topbar__new-chat-btn"
            onClick={onNewChat}
            aria-label="Start new chat"
            title="New chat"
          >
            <SquarePen size={16} />
            <span>New chat</span>
          </button>
        )}
        <div
          className={`status-badge ${isOnline ? "status-badge--online" : "status-badge--offline"}`}
          role="status"
          aria-label={isOnline ? "Online" : "Offline"}
        >
          <span className="status-badge__dot" />
          <span className="status-badge__label">
            {isOnline ? "Surface" : "Tunnel"}
          </span>
        </div>
      </div>
    </header>
  );
}
