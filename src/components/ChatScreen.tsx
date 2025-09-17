import React, { useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import ResetButton from "./ResetButton";
import "../styles/App.scss";

const BACKEND_API = "http://localhost:3001";

export default function ChatScreen() {
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot" }[]
  >([]);

  const handleSend = async (text: string) => {
    setMessages((prev) => [...prev, { text, sender: "user" }]);

    // console.log(process.env.BACKEND_API);

    const res = await fetch(`${BACKEND_API}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        sessionId: sessionStorage.getItem("sessionId"),
      }),
    });
    const data = await res.json();
    console.log(data);
    sessionStorage.setItem("sessionId", data.sessionId);
    setMessages((prev) => [...prev, { text: data.response, sender: "bot" }]);
  };

  const getCachedMessages = async (sessionId: string) => {
    try {
      const res = await fetch(`${BACKEND_API}/api/cache/${sessionId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setMessages(
        data.history.map((msg: any) => ({
          text: msg.content,
          sender: msg.role,
        }))
      );
      console.log();
    } catch (error) {
      console.error(error);
    }
  };

  const resetChat = async (sessionId: string) => {
    try {
      const res = await fetch(`${BACKEND_API}/api/history/${sessionId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      alert("Chat history has been cleared.");
      setMessages([]);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(sessionStorage.getItem("sessionId"));
    if (sessionStorage.getItem("sessionId")) {
      getCachedMessages(sessionStorage.getItem("sessionId")!);
    }
  }, []);

  return (
    <div className="chat-screen">
      <div className="messages">
        {messages.map((msg, i) => (
          <MessageBubble key={i} text={msg.text} sender={msg.sender} />
        ))}
      </div>
      <ChatInput onSend={handleSend} />
      <ResetButton
        onReset={() => resetChat(sessionStorage.getItem("sessionId")!)}
      />
    </div>
  );
}
