import { TUBE_VETERAN_NAME } from "../constants";
import "./TypingIndicator.css";

export default function TypingIndicator() {
  return (
    <div className="typing-indicator-wrapper" aria-label="AI is thinking">
      <div className="typing-indicator">
        <span className="typing-indicator__name">{TUBE_VETERAN_NAME}</span>
        <div className="typing-indicator__dots">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
      </div>
    </div>
  );
}
