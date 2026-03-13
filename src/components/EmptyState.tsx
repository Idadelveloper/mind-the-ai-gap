import { SUGGESTION_CHIPS } from "../constants";
import "./EmptyState.css";

interface EmptyStateProps {
  onSuggestion: (text: string) => void;
}

export default function EmptyState({ onSuggestion }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {/* London Underground roundel */}
      <div className="empty-state__roundel" aria-hidden="true">
        <div className="roundel__ring" />
        <div className="roundel__bar">
          <span>AI</span>
        </div>
      </div>

      <h2 className="empty-state__title">Mind the AI Gap</h2>
      <p className="empty-state__subtitle">
        Your grumpy but knowledgeable guide to the London Underground.
        <br />
        Ask me anything about the Tube — I've seen it all, haven't I.
      </p>

      {/* Fake Tube status board */}
      <div className="status-board" aria-label="Tube line status">
        <div className="status-board__header">Service Status</div>
        <div className="status-board__lines">
          <div className="status-line">
            <span className="status-line__dot" style={{ background: "#E32017" }} />
            <span className="status-line__name">Central</span>
            <span className="status-line__status good">Good service</span>
          </div>
          <div className="status-line">
            <span className="status-line__dot" style={{ background: "#000000" }} />
            <span className="status-line__name">Northern</span>
            <span className="status-line__status bad">Minor delays</span>
          </div>
          <div className="status-line">
            <span className="status-line__dot" style={{ background: "#FFD300" }} />
            <span className="status-line__name">Circle</span>
            <span className="status-line__status good">Good service</span>
          </div>
          <div className="status-line">
            <span className="status-line__dot" style={{ background: "#0098D4" }} />
            <span className="status-line__name">Victoria</span>
            <span className="status-line__status good">Good service</span>
          </div>
        </div>
      </div>

      <p className="empty-state__hint">Try asking:</p>
      <div className="suggestion-chips">
        {SUGGESTION_CHIPS.map((chip) => (
          <button
            key={chip}
            className="suggestion-chip"
            onClick={() => onSuggestion(chip)}
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
