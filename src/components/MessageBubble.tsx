import React from "react";
import "../styles/App.scss";

export default function MessageBubble({
  text,
  sender,
}: {
  text: string;
  sender: "user" | "bot";
}) {
  return <div className={`message ${sender}`}>{text}</div>;
}
