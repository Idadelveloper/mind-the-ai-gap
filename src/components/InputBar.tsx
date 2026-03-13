import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import { Send, Camera, X } from "lucide-react";
import "./InputBar.css";

interface InputBarProps {
  onSend: (text: string, imageFile?: File) => void;
  isLoading: boolean;
}

export default function InputBar({ onSend, isLoading }: InputBarProps) {
  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSend = (text.trim() || selectedImage) && !isLoading;

  const handleSend = useCallback(async () => {
    if (!canSend) return;
    const message = text.trim();
    const imageFile = selectedImage || undefined;

    // Reset input immediately for snappy UX
    setText("");
    setSelectedImage(null);
    setImagePreview(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    onSend(message, imageFile);
  }, [canSend, text, selectedImage, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Auto-resize textarea
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    // Reset file input so same file can be re-selected
    e.target.value = "";
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <div className="input-bar">
      {/* Image preview */}
      {imagePreview && (
        <div className="input-bar__preview">
          <img src={imagePreview} alt="Selected" className="preview__thumb" />
          <button
            className="preview__remove"
            onClick={handleRemoveImage}
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="input-bar__row">
        {/* Camera / image upload button */}
        <button
          className="input-bar__icon-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          aria-label="Attach image"
          title="Upload a photo for analysis"
        >
          <Camera size={20} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          style={{ display: "none" }}
          aria-hidden="true"
        />

        {/* Text input */}
        <textarea
          ref={textareaRef}
          className="input-bar__textarea"
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder={isLoading ? "Hold on, I'm thinking..." : "Ask about the Tube..."}
          disabled={isLoading}
          rows={1}
          aria-label="Message input"
        />

        {/* Send button */}
        <button
          className={`input-bar__send-btn ${canSend ? "input-bar__send-btn--active" : ""}`}
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
