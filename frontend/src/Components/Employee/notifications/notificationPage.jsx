import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Trash2,
  CheckCheck,
  Inbox,
  Bell,
} from "lucide-react";
import EmployeeSidebar from "../SidebarMenu/EmployeeSidebar";
import { useNotification } from "../notifications/Notifications";

/* ─── Type config ─── */
const TYPE_CONFIG = {
  success: {
    icon: CheckCircle2,
    color: "#34d399",
    bg: "rgba(52,211,153,0.10)",
    border: "rgba(52,211,153,0.18)",
    label: "Success",
  },
  error: {
    icon: AlertTriangle,
    color: "#f87171",
    bg: "rgba(248,113,113,0.10)",
    border: "rgba(248,113,113,0.18)",
    label: "Alert",
  },
  info: {
    icon: Info,
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.10)",
    border: "rgba(96,165,250,0.18)",
    label: "Info",
  },
  task: {
    icon: Clock,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.10)",
    border: "rgba(167,139,250,0.18)",
    label: "Task",
  },
};

const FILTERS = ["All", "Unread", "Task", "Info", "Success", "Error"];

const formatTime = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? "s" : ""} ago`;
};

const buildNotificationsFromTasks = (tasks) => {
  const now = new Date();
  const list = [];

  tasks.forEach((task) => {
    const due = new Date(task.dueDate);
    const isOverdue = task.status?.toLowerCase() !== "completed" && due < now;
    const isDueSoon =
      task.status?.toLowerCase() !== "completed" &&
      due >= now &&
      due - now < 1000 * 60 * 60 * 48;

    if (isOverdue) {
      list.push({
        id: `overdue-${task._id}`,
        type: "error",
        title: "Task overdue",
        message: `"${task.taskName}" was due on ${due.toLocaleDateString([], { month: "short", day: "numeric" })} and is now overdue.`,
        time: due,
        read: false,
      });
    } else if (isDueSoon) {
      list.push({
        id: `soon-${task._id}`,
        type: "task",
        title: "Deadline approaching",
        message: `"${task.taskName}" is due on ${due.toLocaleDateString([], { month: "short", day: "numeric" })}. Don't miss it!`,
        time: new Date(Date.now() - 1000 * 60 * 30),
        read: false,
      });
    }

    if (task.status?.toLowerCase() === "completed") {
      list.push({
        id: `done-${task._id}`,
        type: "success",
        title: "Task completed",
        message: `You marked "${task.taskName}" as completed. Great work!`,
        time: new Date(Date.now() - 1000 * 60 * 60 * 3),
        read: true,
      });
    }
  });

  list.push(
    {
      id: "sys-1",
      type: "info",
      title: "Welcome to WorkHub",
      message:
        "Your employee account is active. Explore your dashboard and tasks.",
      time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      read: true,
    },
    {
      id: "sys-2",
      type: "info",
      title: "Profile reminder",
      message:
        "Make sure your profile is complete — add your phone number and avatar.",
      time: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
    },
  );

  return list.sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1;
    return new Date(b.time) - new Date(a.time);
  });
};

/* ══════════════════════════════════════════ */
const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // Pull setUnreadCount from context to keep sidebar badge in sync
  const { setUnreadCount } = useNotification();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(import.meta.env.VITE_API_URL + "/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const tasks = Array.isArray(data) ? data : [];
        const built = buildNotificationsFromTasks(tasks);
        setNotifications(built);
        // ← sync real unread count into context immediately
        setUnreadCount(built.filter((n) => !n.read).length);
      })
      .catch(() => {
        const built = buildNotificationsFromTasks([]);
        setNotifications(built);
        setUnreadCount(built.filter((n) => !n.read).length);
      })
      .finally(() => setLoading(false));
  }, []);

  // Keep context in sync whenever notifications change
  useEffect(() => {
    const count = notifications.filter((n) => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const markAllRead = () =>
    setNotifications((p) => p.map((n) => ({ ...n, read: true })));

  const markRead = (id) =>
    setNotifications((p) =>
      p.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

  const deleteNotif = (id) =>
    setNotifications((p) => p.filter((n) => n.id !== id));

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (filter === "All") return true;
    if (filter === "Unread") return !n.read;
    return n.type === filter.toLowerCase();
  });

  const cardStyle = {
    background: "linear-gradient(145deg,#0d1424,#080d18)",
    border: "1px solid rgba(255,255,255,0.06)",
  };

  return (
    <div className="flex min-h-screen bg-[#080C14]">
      <EmployeeSidebar />

      <div className="md:ml-64 flex-1 px-4 md:px-10 pt-16 md:pt-8 pb-8 flex flex-col gap-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(167,139,250,0.12)" }}
            >
              <Bell size={18} style={{ color: "#a78bfa" }} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white/90">
                Notifications
              </h1>
              <p className="text-sm text-white/35 mt-0.5">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                  : "You're all caught up"}
              </p>
            </div>
          </div>

          {notifications.length > 0 && (
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                  style={{
                    background: "rgba(52,211,153,0.1)",
                    color: "#34d399",
                    border: "1px solid rgba(52,211,153,0.18)",
                  }}
                >
                  <CheckCheck size={12} />
                  Mark all read
                </button>
              )}
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                style={{
                  background: "rgba(248,113,113,0.08)",
                  color: "#f87171",
                  border: "1px solid rgba(248,113,113,0.15)",
                }}
              >
                <Trash2 size={12} />
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Filter tabs */}
        <div
          className="flex gap-1 p-1 rounded-xl flex-wrap"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={
                filter === f
                  ? { background: "rgba(99,102,241,0.2)", color: "#a78bfa" }
                  : { color: "rgba(255,255,255,0.35)" }
              }
            >
              {f}
              {f === "Unread" && unreadCount > 0 && (
                <span
                  className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                  style={{ background: "#ef4444", color: "#fff" }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-2xl h-20 animate-pulse"
                style={{ background: "rgba(255,255,255,0.03)" }}
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div
            className="rounded-2xl py-16 flex flex-col items-center gap-3"
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <Inbox size={22} className="text-white/20" />
            </div>
            <p className="text-sm text-white/30">No notifications here</p>
          </div>
        )}

        {/* List */}
        {!loading && filtered.length > 0 && (
          <div className="flex flex-col gap-2.5">
            {filtered.map((notif) => {
              const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.info;
              const Icon = cfg.icon;

              return (
                <div
                  key={notif.id}
                  onClick={() => markRead(notif.id)}
                  className="group relative flex items-start gap-4 px-5 py-4 rounded-2xl cursor-pointer transition-all duration-200"
                  style={{
                    ...cardStyle,
                    border: notif.read
                      ? "1px solid rgba(255,255,255,0.05)"
                      : `1px solid ${cfg.border}`,
                    opacity: notif.read ? 0.72 : 1,
                  }}
                >
                  {!notif.read && (
                    <div
                      className="absolute top-4 right-10 w-2 h-2 rounded-full"
                      style={{
                        background: cfg.color,
                        boxShadow: `0 0 6px ${cfg.color}`,
                      }}
                    />
                  )}

                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: cfg.bg }}
                  >
                    <Icon
                      size={16}
                      style={{ color: cfg.color }}
                      strokeWidth={2}
                    />
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <p
                        className="text-sm font-medium truncate"
                        style={{
                          color: notif.read
                            ? "rgba(255,255,255,0.5)"
                            : "rgba(255,255,255,0.9)",
                        }}
                      >
                        {notif.title}
                      </p>
                      <span
                        className="shrink-0 text-[10px] px-2 py-0.5 rounded-md font-medium"
                        style={{ color: cfg.color, background: cfg.bg }}
                      >
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-white/35 leading-relaxed">
                      {notif.message}
                    </p>
                    <p className="text-[11px] text-white/20 mt-1.5">
                      {formatTime(notif.time)}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotif(notif.id);
                    }}
                    className="absolute bottom-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg"
                    style={{ color: "rgba(248,113,113,0.5)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#f87171")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(248,113,113,0.5)")
                    }
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
