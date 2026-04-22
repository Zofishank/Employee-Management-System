import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../SidebarMenu/EmployeeSidebar";
import EmojiPicker from "emoji-picker-react";
import { IoMdArrowBack } from "react-icons/io";
import { IoSendSharp } from "react-icons/io5";
import {
  Sparkles,
  MessageCircle,
  Smile,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { intents, fallbackResponse } from "./intent";

/* ─── Quick questions ─── */
const QUICK_QUESTIONS = [
  { label: "Explain this task", key: "task_explain" },
  { label: "What is the deadline?", key: "task_deadline" },
  { label: "What are the steps?", key: "task_steps" },
  { label: "Task priority?", key: "task_priority" },
  { label: "I'm confused", key: "task_confusion" },
  { label: "How do I submit?", key: "task_submission" },
  { label: "Facing an issue", key: "task_issue" },
  { label: "Request feedback", key: "task_feedback" },
  { label: "Manage my time", key: "task_time_management" },
  { label: "Report a delay", key: "task_delay" },
];

const detectIntent = (text) => {
  const lower = text.toLowerCase();
  for (const key in intents) {
    const intent = intents[key];
    if (intent.keywords.some((kw) => lower.includes(kw))) {
      return { response: intent.response, matched: key };
    }
  }
  return { response: fallbackResponse, matched: null };
};

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: crypto.randomUUID(),
      sender: "ai",
      text: "Hi! I'm your AI Assistant. Select a quick question below or type your own to get started.",
    },
  ]);
  const [adminMessages, setAdminMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showAdminChat, setShowAdminChat] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Suggestions are always visible at bottom — just collapsible
  const [suggestionsExpanded, setSuggestionsExpanded] = useState(true);

  const chatRef = useRef(null);
  const emojiRef = useRef(null);
  const inputRef = useRef(null);
  const prevCount = useRef(0);

  const token = localStorage.getItem("token");
  const ADMIN_ID = import.meta.env;

  /* ── close emoji on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target))
        setShowEmojiPicker(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── poll admin messages ── */
  useEffect(() => {
    const fetchAdminMessages = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + "/api/messages", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setAdminMessages(
            data
              .filter((msg) => {
                const sid = msg.sender?._id || msg.sender;
                const rid = msg.receiver?._id || msg.receiver;
                return sid === ADMIN_ID || rid === ADMIN_ID;
              })
              .map((msg) => ({
                _id: msg._id,
                text: msg.text,
                senderRole: msg.sender?._id === ADMIN_ID ? "admin" : "employee",
                status: msg.status || "sent",
              })),
          );
        }
      } catch {
        /* silent */
      }
    };
    fetchAdminMessages();
    const iv = setInterval(fetchAdminMessages, 2000);
    return () => clearInterval(iv);
  }, [token]);

  /* ── auto scroll on new message ── */
  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    const total = (showAdminChat ? adminMessages : messages).length;
    if (total > prevCount.current)
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    prevCount.current = total;
  }, [messages, adminMessages, showAdminChat]);

  /* ── send AI message ── */
  const sendMessage = (text) => {
    if (!text.trim()) return;
    const { response } = detectIntent(text);
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), sender: "user", text },
      { id: crypto.randomUUID(), sender: "ai", text: response },
    ]);
    setInput("");
    // Always re-expand suggestions after a reply so user sees them
    setSuggestionsExpanded(true);
    inputRef.current?.focus();
  };

  /* ── send admin message ── */
  const sendAdminMessage = async (text) => {
    if (!text.trim()) return;
    const tempId = `temp-${Date.now()}`;
    setAdminMessages((prev) => [
      ...prev,
      { _id: tempId, text, senderRole: "employee", status: "sending" },
    ]);
    setInput("");
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + "/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, receiver: ADMIN_ID }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setAdminMessages((prev) =>
        prev.map((m) =>
          m._id === tempId
            ? { ...data, senderRole: "employee", status: "sent" }
            : m,
        ),
      );
    } catch {
      setAdminMessages((prev) => prev.filter((m) => m._id !== tempId));
    }
  };

  const handleSend = () =>
    showAdminChat ? sendAdminMessage(input) : sendMessage(input);

  const currentMessages = showAdminChat ? adminMessages : messages;

  return (
    <div className="flex w-full min-h-screen bg-[#080C14]">
      <Sidebar />

      <div className="ml-16 md:ml-64 w-full flex items-center justify-center p-4 md:p-6">
        <div
          className="w-full max-w-2xl flex flex-col"
          style={{
            height: "calc(100vh - 48px)",
            background: "linear-gradient(145deg,#0d1424,#080d18)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "20px",
            boxShadow:
              "0 0 0 1px rgba(99,179,237,0.04), 0 32px 80px rgba(0,0,0,0.6)",
            overflow: "hidden",
          }}
        >
          {/* ── HEADER ── */}
          <div
            className="flex items-center gap-3 px-5 py-4 shrink-0"
            style={{
              background: "rgba(255,255,255,0.02)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {showAdminChat && (
              <button
                onClick={() => setShowAdminChat(false)}
                className="text-white/50 hover:text-white/90 transition mr-1"
              >
                <IoMdArrowBack size={18} />
              </button>
            )}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: showAdminChat
                  ? "rgba(96,165,250,0.15)"
                  : "rgba(139,92,246,0.15)",
              }}
            >
              {showAdminChat ? (
                <MessageCircle size={16} style={{ color: "#60a5fa" }} />
              ) : (
                <Sparkles size={16} style={{ color: "#a78bfa" }} />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-white/90">
                {showAdminChat ? "Admin Chat" : "AI Assistant"}
              </p>
              <p className="text-[11px] text-white/30">
                {showAdminChat
                  ? "Direct message to admin"
                  : "Always here to help"}
              </p>
            </div>
            {!showAdminChat && (
              <button
                onClick={() => setShowAdminChat(true)}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                style={{
                  background: "rgba(96,165,250,0.1)",
                  color: "#60a5fa",
                  border: "1px solid rgba(96,165,250,0.2)",
                }}
              >
                <MessageCircle size={12} />
                Ask Admin
              </button>
            )}
          </div>

          {/* ── MESSAGES ── */}
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.08) transparent",
            }}
          >
            {currentMessages.map((msg) => {
              const isAI = msg.sender === "ai" || msg.senderRole === "admin";
              return (
                <div
                  key={msg._id || msg.id}
                  className={`flex gap-2.5 ${isAI ? "justify-start" : "justify-end"}`}
                >
                  {isAI && (
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        background: showAdminChat
                          ? "rgba(96,165,250,0.12)"
                          : "rgba(139,92,246,0.12)",
                      }}
                    >
                      {showAdminChat ? (
                        <MessageCircle size={13} style={{ color: "#60a5fa" }} />
                      ) : (
                        <Sparkles size={13} style={{ color: "#a78bfa" }} />
                      )}
                    </div>
                  )}
                  <div
                    className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed max-w-[78%]"
                    style={
                      isAI
                        ? {
                            background: "rgba(255,255,255,0.05)",
                            color: "rgba(255,255,255,0.8)",
                            borderRadius: "4px 16px 16px 16px",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }
                        : {
                            background:
                              "linear-gradient(135deg,#3b82f6,#6366f1)",
                            color: "#fff",
                            borderRadius: "16px 4px 16px 16px",
                          }
                    }
                  >
                    {msg.text}
                    {msg.status === "sending" && (
                      <span className="text-[10px] text-white/40 ml-2">
                        sending...
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── SUGGESTIONS — pinned above input, only in AI mode ── */}
          {!showAdminChat && (
            <div
              className="shrink-0 px-4 pt-3 pb-1"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              {/* Collapse toggle */}
              <button
                onClick={() => setSuggestionsExpanded((p) => !p)}
                className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/55 transition mb-2 w-fit"
              >
                {suggestionsExpanded ? (
                  <ChevronDown size={11} />
                ) : (
                  <ChevronUp size={11} />
                )}
                {suggestionsExpanded ? "Hide suggestions" : "Show suggestions"}
              </button>

              {/* Pill buttons — always at bottom, always visible after every reply */}
              {suggestionsExpanded && (
                <div
                  className="flex flex-wrap gap-1.5 pb-1 max-h-24 overflow-y-auto"
                  style={{ scrollbarWidth: "none" }}
                >
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q.key}
                      onClick={() => sendMessage(q.label)}
                      className="px-3 py-1 rounded-lg text-[11px] transition-all shrink-0"
                      style={{
                        background: "rgba(139,92,246,0.08)",
                        color: "rgba(167,139,250,0.8)",
                        border: "1px solid rgba(139,92,246,0.15)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(139,92,246,0.2)";
                        e.currentTarget.style.color = "#c4b5fd";
                        e.currentTarget.style.border =
                          "1px solid rgba(139,92,246,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(139,92,246,0.08)";
                        e.currentTarget.style.color = "rgba(167,139,250,0.8)";
                        e.currentTarget.style.border =
                          "1px solid rgba(139,92,246,0.15)";
                      }}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── INPUT ── */}
          <div
            className="px-4 py-3 shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="relative" ref={emojiRef}>
                <button
                  onClick={() => setShowEmojiPicker((p) => !p)}
                  className="text-white/30 hover:text-white/60 transition p-1"
                >
                  <Smile size={18} />
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-12 left-0 z-50">
                    <EmojiPicker
                      theme="dark"
                      onEmojiClick={(e) => setInput((p) => p + e.emoji)}
                    />
                  </div>
                )}
              </div>

              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={
                  showAdminChat
                    ? "Message admin..."
                    : "Ask anything about your tasks..."
                }
                className="flex-1 bg-transparent text-sm text-white/80 placeholder-white/25 outline-none"
              />

              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition disabled:opacity-30"
                style={{
                  background: input.trim()
                    ? "linear-gradient(135deg,#3b82f6,#6366f1)"
                    : "rgba(255,255,255,0.06)",
                }}
              >
                <IoSendSharp size={14} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
