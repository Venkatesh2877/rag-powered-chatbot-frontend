import React from "react";

interface ResetButtonProps {
  onReset: () => void;
}

export default function ResetButton({ onReset }: ResetButtonProps) {
  return (
    <button className="reset-button" onClick={onReset}>
      Reset Session
    </button>
  );
}
