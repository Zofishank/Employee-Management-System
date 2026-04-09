import React, { useEffect, useRef, useState, useCallback } from "react";
import AdminSidebar from "../SidebarMenu/AdminSidebar";
import { MessageSquare, Send, Users } from "lucide-react";

const BASE_URL = "http://localhost:5000";

const Avatar = ({ user, size = 36 }) => {
  const [err, setErr] = useState(false);
  const avatarUrl = user?.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${BASE_URL}${user.avatar}`
    : null;
  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "?";

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        background: "rgba(14,165,233,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {avatarUrl && !err ? (
        <img
          src={avatarUrl}
          alt={user.username}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={() => setErr(true)}
        />
      ) : (
        <span
          style={{ fontSize: size * 0.36, fontWeight: 700, color: "#38bdf8" }}
        >
          {initials}
        </span>
      )}
    </div>
  );
};

const AdminEmployeeQueries = () => {
  const [messages, setMessages] = useState([]);
  const [activeUserId, setActiveUserId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [mobileView, setMobileView] = useState("list");

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const token = localStorage.getItem("token");

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/admin/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [token]);

  // Group messages by user and sort chronologically
  const groupedByUser = useCallback(() => {
    const grouped = {};

    messages.forEach((msg) => {
      const userId =
        msg.senderRole === "employee"
          ? msg.sender?._id || msg.sender
          : msg.receiver?._id || msg.receiver;

      if (!userId) return;

      if (!grouped[userId]) grouped[userId] = [];
      grouped[userId].push(msg);
    });

    // Sort messages within each user (oldest first)
    Object.keys(grouped).forEach((userId) => {
      grouped[userId].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );
    });

    return grouped;
  }, [messages]);

  const grouped = groupedByUser();
  const userIds = Object.keys(grouped);

  const getEmployee = (userId) => {
    const msgs = grouped[userId] || [];
    return (
      msgs.find((m) => m.senderRole === "employee")?.sender || {
        _id: userId,
        username: "Employee",
      }
    );
  };

  const getUnreadCount = (userId) => {
    return (grouped[userId] || []).filter(
      (m) => m.senderRole === "employee" && m.status !== "seen",
    ).length;
  };

  const activeChat = activeUserId ? grouped[activeUserId] || [] : [];
  const activeEmployee = activeUserId ? getEmployee(activeUserId) : null;

  // Mark messages as seen
  const markAsSeen = useCallback(
    async (userId) => {
      const unseen = (grouped[userId] || []).filter(
        (m) =>
          m.senderRole === "employee" &&
          m.status === "sent" &&
          m._id &&
          !String(m._id).startsWith("temp"),
      );

      for (const msg of unseen) {
        try {
          await fetch(`${BASE_URL}/api/admin/messages/${msg._id}/seen`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (err) {
          console.error(err);
        }
      }
    },
    [grouped, token],
  );

  const handleSelectUser = useCallback(
    (userId) => {
      setActiveUserId(userId);
      setMobileView("chat");
      markAsSeen(userId);
    },
    [markAsSeen],
  );

  // Scroll to bottom when chat opens or new messages arrive
  useEffect(() => {
    if (activeUserId && messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100);
    }
  }, [activeUserId, activeChat.length]);

  // Send reply
  const sendReply = useCallback(
    async (e) => {
      e.preventDefault();
      if (!replyText.trim() || !activeUserId || sending) return;

      setSending(true);
      const tempId = `temp-${Date.now()}`;
      const text = replyText.trim();

      const tempMessage = {
        _id: tempId,
        text,
        senderRole: "admin",
        status: "sending",
        createdAt: new Date().toISOString(),
        receiver: { _id: activeUserId },
      };

      setMessages((prev) => [...prev, tempMessage]);
      setReplyText("");

      try {
        const res = await fetch(`${BASE_URL}/api/admin/messages/reply`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text, employeeId: activeUserId }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setMessages((prev) =>
          prev.map((m) =>
            m._id === tempId ? { ...data, senderRole: "admin" } : m,
          ),
        );
      } catch (err) {
        console.error(err);
        setMessages((prev) => prev.filter((m) => m._id !== tempId));
      } finally {
        setSending(false);
      }
    },
    [replyText, activeUserId, sending, token],
  );

  // Scrollbar styles
  const scrollbarStyles = {
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(255,255,255,0.2) transparent",
    WebkitScrollbar: {
      width: "6px",
      height: "6px",
    },
    WebkitScrollbarTrack: {
      background: "transparent",
    },
    WebkitScrollbarThumb: {
      background: "rgba(255,255,255,0.2)",
      borderRadius: "10px",
    },
    WebkitScrollbarThumbHover: {
      background: "rgba(255,255,255,0.3)",
    },
  };

  const cardStyle = {
    background: "linear-gradient(145deg,#0d1424,#080d18)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 16,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#080C14" }}>
      <AdminSidebar />

      <div
        style={{
          flex: 1,
          marginLeft: "256px",
          display: "flex",
          flexDirection: "column",
          padding: "24px",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "rgba(14,165,233,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MessageSquare size={18} color="#38bdf8" />
          </div>
          <div>
            <h1
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "rgba(255,255,255,0.9)",
                margin: 0,
              }}
            >
              Employee Queries
            </h1>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.3)",
                margin: "2px 0 0",
              }}
            >
              Manage support conversations
            </p>
          </div>
        </div>

        {/* Desktop Layout */}
        <div
          className="hidden md:flex"
          style={{ gap: 16, flex: 1, minHeight: 0 }}
        >
          {/* Users List */}
          <div
            style={{
              width: 300,
              flexShrink: 0,
              ...cardStyle,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Users size={13} color="rgba(255,255,255,0.3)" />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                Active Chats ({userIds.length})
              </span>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                ...scrollbarStyles,
                "&::-webkit-scrollbar": scrollbarStyles.WebkitScrollbar,
                "&::-webkit-scrollbar-track":
                  scrollbarStyles.WebkitScrollbarTrack,
                "&::-webkit-scrollbar-thumb":
                  scrollbarStyles.WebkitScrollbarThumb,
                "&::-webkit-scrollbar-thumb:hover":
                  scrollbarStyles.WebkitScrollbarThumbHover,
              }}
            >
              {userIds.length === 0 ? (
                <div
                  style={{
                    padding: "48px 16px",
                    textAlign: "center",
                    color: "rgba(255,255,255,0.18)",
                    fontSize: 13,
                  }}
                >
                  No messages yet
                </div>
              ) : (
                userIds.map((userId) => {
                  const userMessages = grouped[userId] || [];
                  const lastMessage = userMessages[userMessages.length - 1];
                  const employee = getEmployee(userId);
                  const unread = getUnreadCount(userId);
                  const isActive = activeUserId === userId;

                  return (
                    <button
                      key={userId}
                      onClick={() => handleSelectUser(userId)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        background: isActive
                          ? "rgba(14,165,233,0.09)"
                          : "transparent",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        borderLeft: isActive
                          ? "3px solid #38bdf8"
                          : "3px solid transparent",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <Avatar user={employee} size={42} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "rgba(255,255,255,0.85)",
                            margin: 0,
                            marginBottom: 4,
                            textTransform: "capitalize",
                          }}
                        >
                          {employee?.username || "Employee"}
                        </p>
                        <p
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.3)",
                            margin: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {lastMessage?.text || "No messages yet"}
                        </p>
                      </div>
                      {unread > 0 && (
                        <span
                          style={{
                            background: "#ef4444",
                            color: "#fff",
                            fontSize: 11,
                            fontWeight: 700,
                            minWidth: 22,
                            height: 22,
                            borderRadius: 11,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0 6px",
                          }}
                        >
                          {unread}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div
            style={{
              ...cardStyle,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {!activeUserId ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 20,
                      background: "rgba(255,255,255,0.03)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                    }}
                  >
                    <MessageSquare size={28} color="rgba(255,255,255,0.1)" />
                  </div>
                  <span
                    style={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }}
                  >
                    Select an employee to start chatting
                  </span>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div
                  style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <Avatar user={activeEmployee} size={40} />
                  <div>
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.9)",
                        margin: 0,
                        textTransform: "capitalize",
                      }}
                    >
                      {activeEmployee?.username || "Employee"}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.35)",
                        margin: "2px 0 0",
                      }}
                    >
                      Employee
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div
                  ref={messagesContainerRef}
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(255,255,255,0.2) transparent",
                  }}
                  className="custom-scrollbar"
                >
                  <style>
                    {`
                      .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                        height: 6px;
                      }
                      .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                      }
                      .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(255, 255, 255, 0.2);
                        border-radius: 10px;
                      }
                      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: rgba(255, 255, 255, 0.3);
                      }
                    `}
                  </style>
                  {activeChat.map((msg) => {
                    const isAdmin = msg.senderRole === "admin";
                    const time = msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "";

                    return (
                      <div
                        key={msg._id}
                        style={{
                          display: "flex",
                          gap: 10,
                          justifyContent: isAdmin ? "flex-end" : "flex-start",
                          alignItems: "flex-end",
                        }}
                      >
                        {!isAdmin && <Avatar user={activeEmployee} size={32} />}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                            maxWidth: "70%",
                          }}
                        >
                          <div
                            style={
                              isAdmin
                                ? {
                                    background:
                                      "linear-gradient(135deg,#0ea5e9,#6366f1)",
                                    color: "#fff",
                                    borderRadius: "18px 4px 18px 18px",
                                    padding: "10px 16px",
                                    fontSize: 14,
                                  }
                                : {
                                    background: "rgba(255,255,255,0.07)",
                                    color: "rgba(255,255,255,0.9)",
                                    borderRadius: "4px 18px 18px 18px",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    padding: "10px 16px",
                                    fontSize: 14,
                                  }
                            }
                          >
                            {msg.text}
                          </div>
                          <p
                            style={{
                              fontSize: 10,
                              margin: 0,
                              color: "rgba(255,255,255,0.3)",
                              textAlign: isAdmin ? "right" : "left",
                            }}
                          >
                            {msg.status === "sending" ? "Sending..." : time}
                          </p>
                        </div>
                        {isAdmin && (
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              background: "rgba(99,102,241,0.2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#818cf8",
                              }}
                            >
                              AD
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form
                  onSubmit={sendReply}
                  style={{
                    padding: "16px 20px",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    gap: 12,
                  }}
                >
                  <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your message..."
                    style={{
                      flex: 1,
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 12,
                      padding: "12px 16px",
                      fontSize: 14,
                      color: "rgba(255,255,255,0.9)",
                      outline: "none",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim() || sending}
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 12,
                      border: "none",
                      background:
                        replyText.trim() && !sending
                          ? "linear-gradient(135deg,#0ea5e9,#6366f1)"
                          : "rgba(255,255,255,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: !replyText.trim() || sending ? 0.5 : 1,
                      cursor:
                        replyText.trim() && !sending
                          ? "pointer"
                          : "not-allowed",
                    }}
                  >
                    <Send size={18} color="#fff" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden" style={{ flex: 1, minHeight: 0 }}>
          {mobileView === "list" ? (
            <div
              style={{
                ...cardStyle,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "16px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Users size={13} color="rgba(255,255,255,0.3)" />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  Active Chats ({userIds.length})
                </span>
              </div>
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(255,255,255,0.2) transparent",
                }}
              >
                {userIds.map((userId) => {
                  const userMessages = grouped[userId] || [];
                  const lastMessage = userMessages[userMessages.length - 1];
                  const employee = getEmployee(userId);
                  const unread = getUnreadCount(userId);

                  return (
                    <button
                      key={userId}
                      onClick={() => handleSelectUser(userId)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        cursor: "pointer",
                        background: "transparent",
                      }}
                    >
                      <Avatar user={employee} size={42} />
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "rgba(255,255,255,0.85)",
                            margin: 0,
                            marginBottom: 4,
                            textTransform: "capitalize",
                          }}
                        >
                          {employee?.username || "Employee"}
                        </p>
                        <p
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.3)",
                            margin: 0,
                          }}
                        >
                          {lastMessage?.text || "No messages yet"}
                        </p>
                      </div>
                      {unread > 0 && (
                        <span
                          style={{
                            background: "#ef4444",
                            color: "#fff",
                            fontSize: 11,
                            fontWeight: 700,
                            minWidth: 22,
                            height: 22,
                            borderRadius: 11,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0 6px",
                          }}
                        >
                          {unread}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div
              style={{
                ...cardStyle,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "16px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <button
                  onClick={() => {
                    setActiveUserId(null);
                    setMobileView("list");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.6)",
                    cursor: "pointer",
                    fontSize: 24,
                    padding: 0,
                    width: 32,
                  }}
                >
                  ←
                </button>
                <Avatar user={activeEmployee} size={36} />
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.9)",
                    margin: 0,
                    textTransform: "capitalize",
                  }}
                >
                  {activeEmployee?.username || "Chat"}
                </p>
              </div>

              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(255,255,255,0.2) transparent",
                }}
              >
                {activeChat.map((msg) => {
                  const isAdmin = msg.senderRole === "admin";
                  const time = msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "";
                  return (
                    <div
                      key={msg._id}
                      style={{
                        display: "flex",
                        gap: 8,
                        justifyContent: isAdmin ? "flex-end" : "flex-start",
                        alignItems: "flex-end",
                      }}
                    >
                      {!isAdmin && <Avatar user={activeEmployee} size={28} />}
                      <div style={{ maxWidth: "75%" }}>
                        <div
                          style={
                            isAdmin
                              ? {
                                  background:
                                    "linear-gradient(135deg,#0ea5e9,#6366f1)",
                                  color: "#fff",
                                  borderRadius: "16px 4px 16px 16px",
                                  padding: "10px 14px",
                                  fontSize: 14,
                                }
                              : {
                                  background: "rgba(255,255,255,0.07)",
                                  color: "rgba(255,255,255,0.9)",
                                  borderRadius: "4px 16px 16px 16px",
                                  padding: "10px 14px",
                                  fontSize: 14,
                                }
                          }
                        >
                          {msg.text}
                        </div>
                        <p
                          style={{
                            fontSize: 10,
                            margin: "4px 0 0",
                            color: "rgba(255,255,255,0.3)",
                            textAlign: isAdmin ? "right" : "left",
                          }}
                        >
                          {msg.status === "sending" ? "Sending..." : time}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={sendReply}
                style={{
                  padding: "16px",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  gap: 8,
                }}
              >
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type a message..."
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    padding: "12px",
                    fontSize: 14,
                    color: "rgba(255,255,255,0.9)",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  disabled={!replyText.trim() || sending}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    border: "none",
                    background:
                      replyText.trim() && !sending
                        ? "linear-gradient(135deg,#0ea5e9,#6366f1)"
                        : "rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: !replyText.trim() || sending ? 0.5 : 1,
                  }}
                >
                  <Send size={16} color="#fff" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEmployeeQueries;
