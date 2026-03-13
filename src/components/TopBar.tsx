import { Train } from "lucide-react";
import "./TopBar.css";

interface TopBarProps {
  isOnline: boolean;
}

export default function TopBar({ isOnline }: TopBarProps) {
  return (
    <header className="topbar" role="banner">
      <div className="topbar__left">
        <div className="topbar__icon" aria-hidden="true">
          <Train size={20} strokeWidth={2} />
        </div>
        <div className="topbar__title-group">
          <h1 className="topbar__title">Mind the AI Gap</h1>
          <p className="topbar__subtitle">London Underground AI Companion</p>
        </div>
      </div>

      <div className="topbar__right">
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
