import type { InferenceSource } from "../types";
import "./InferenceChip.css";

interface InferenceChipProps {
  source: InferenceSource;
}

const CONFIG: Record<
  InferenceSource,
  { emoji: string; label: string; className: string }
> = {
  on_device: {
    emoji: "⚡",
    label: "On-Device",
    className: "chip--on-device",
  },
  in_cloud: {
    emoji: "☁️",
    label: "Cloud",
    className: "chip--cloud",
  },
  mock: {
    emoji: "⚙️",
    label: "Mock",
    className: "chip--mock",
  },
};

export default function InferenceChip({ source }: InferenceChipProps) {
  const { emoji, label, className } = CONFIG[source];
  return (
    <span className={`inference-chip ${className}`} title={`Inference: ${label}`}>
      {emoji} {label}
    </span>
  );
}
