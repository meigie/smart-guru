"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export function GeminiChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;
    setLoading(true);
    setMessages((msgs) => [...msgs, { role: "user", text: input }]);
    const res = await fetch("/api/gemini-chat", {
      method: "POST",
      body: JSON.stringify({ prompt: input }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setMessages((msgs) => [
      ...msgs,
      { role: "gemini", text: data.text || "No response from Gemini." },
    ]);
    setInput("");
    setLoading(false);
  }

  return (
    <div>
      <div className="mb-4 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
            <span className={msg.role === "user" ? "font-bold text-blue-600" : "font-bold text-green-600"}>
              {msg.role === "user" ? "You" : "Guru"}:
            </span>
            <div className="prose max-w-none">
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="border rounded px-2 py-1 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
          placeholder="Ask anything..."
        />
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded"
          onClick={sendMessage}
          disabled={loading || !input}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
