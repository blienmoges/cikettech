"use client";

import React, { useState, useRef, useEffect } from "react";
import { API_BASE } from "../lib/api";

type Msg = { id: number; from: "bot" | "user"; text: string };

function BotIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="8" width="16" height="11" rx="3" />
      <path d="M12 8V5M9 5h6" />
      <circle cx="9" cy="13.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13.5" r="1.1" fill="currentColor" stroke="none" />
      <path d="M9 17h6" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-6.5-5.6-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}

function FingerprintIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 11c.6 2 .6 4.2-1 6.2M8.4 9.3c1.9-1.5 4.4-1.5 6.3 0M6.2 6.9c3.2-2.7 8.6-2.7 11.8 0M9.4 13.1c.5 1.9-.1 3.8-1.4 5.3M12 3.4c-4.9 0-8.9 3.7-8.9 8.4 0 2.1.5 4 1.2 5.7" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h4M9 12h6M9 15.5h6" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 14 6 10Z" />
      <path d="M10.5 18.5a1.7 1.7 0 0 0 3 0" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 11.5 21 4l-7.5 18-2.7-7.3L3 11.5Z" />
    </svg>
  );
}

const suggestionIcons: Record<string, React.ReactNode> = {
  parking: <PinIcon />,
  biometric: <FingerprintIcon />,
  quote: <DocIcon />,
  "school-bell": <BellIcon />,
};

type Suggestion = { topic: string; label: string };

export default function AIWidget() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const idRef = useRef(1);
  const scroller = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/assistant/welcome`)
      .then((res) => res.json())
      .then((data: { message: string; suggestions: Suggestion[] }) => {
        setMessages([{ id: idRef.current++, from: "bot", text: data.message }]);
        setSuggestions(data.suggestions);
      })
      .catch(() => {
        setMessages([
          {
            id: idRef.current++,
            from: "bot",
            text: "Welcome to CIKETTECH Intelligent Support. How can I assist you with our smart electronic solutions today?",
          },
        ]);
      });
  }, []);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(text?: string) {
    if (pending) return;
    const t = text ?? input.trim();
    if (!t) return;
    const userMsg: Msg = { id: idRef.current++, from: "user", text: t };
    const history = messages.map(({ from, text }) => ({ from, text }));
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setPending(true);

    try {
      const res = await fetch(`${API_BASE}/api/assistant/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: t, history }),
      });
      const data = await res.json();
      const botMsg: Msg = {
        id: idRef.current++,
        from: "bot",
        text: data.reply || "Thanks — I have received your request and our team will follow up shortly.",
      };
      setMessages((m) => [...m, botMsg]);
    } catch {
      setMessages((m) => [
        ...m,
        { id: idRef.current++, from: "bot", text: "Sorry, I'm having trouble connecting right now. Please try again shortly." },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="ai-assistant-wrapper">
      <div className="ai-card">
        <header className="ai-card-header">
          <div className="ai-header-left">
            <div className="ai-logo">
              <BotIcon />
            </div>
            <div>
              <div className="ai-title">AI Assistant</div>
              <div className="ai-sub">CIKETTECH INTELLIGENT SUPPORT</div>
            </div>
          </div>
        </header>

        <div className="ai-card-body" ref={scroller}>
          {messages.map((m) => (
            <div key={m.id} className={m.from === "bot" ? "ai-row ai-row-bot" : "ai-row ai-row-user"}>
              {m.from === "bot" && (
                <div className="ai-avatar">
                  <BotIcon />
                </div>
              )}
              <div className={m.from === "bot" ? "ai-bubble ai-bot" : "ai-bubble ai-user"}>{m.text}</div>
            </div>
          ))}
          {pending && (
            <div className="ai-row ai-row-bot">
              <div className="ai-avatar">
                <BotIcon />
              </div>
              <div className="ai-bubble ai-bot ai-typing">Typing…</div>
            </div>
          )}
        </div>

        <div className="ai-card-suggestions">
          {suggestions.map((s) => (
            <button key={s.label} className="ai-chip" onClick={() => send(s.label)} disabled={pending}>
              <span className="ai-chip-icon">{suggestionIcons[s.topic]}</span>
              {s.label}
            </button>
          ))}
        </div>

        <footer className="ai-card-footer">
          <input
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
            disabled={pending}
          />
          <button className="ai-send" onClick={() => send()} aria-label="Send" disabled={pending}>
            <SendIcon />
          </button>
        </footer>

        <div className="ai-disclaimer">AI responses may be inaccurate. Please verify critical information.</div>
      </div>
    </div>
  );
}
