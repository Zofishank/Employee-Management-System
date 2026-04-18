import React, { useEffect, useState } from "react";
import AdminSidebar from "../SidebarMenu/AdminSidebar";
import {
  History,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
} from "lucide-react";

const STATUS_CONFIG = {
  completed: {
    label: "Completed",
    color: "#34d399",
    bg: "rgba(52,211,153,0.10)",
    Icon: CheckCircle2,
  },
  pending: {
    label: "Pending",
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.10)",
    Icon: Clock,
  },
  expired: {
    label: "Overdue",
    color: "#f87171",
    bg: "rgba(248,113,113,0.10)",
    Icon: AlertTriangle,
  },
};

/* Stat pill data — no `bg` key, border computed inline from color */
const STAT_PILLS = [
  { key: "all", label: "Total", color: "#38bdf8" },
  { key: "pending", label: "Pending", color: "#60a5fa" },
  { key: "completed", label: "Completed", color: "#34d399" },
  { key: "expired", label: "Overdue", color: "#f87171" },
];

const TaskHistory = () => {
  const [taskData, setTaskData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + "/api/tasks/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const sorted = [...data].sort((a, b) => {
          if (a.createdAt && b.createdAt)
            return new Date(b.createdAt) - new Date(a.createdAt);
          return b._id.localeCompare(a._id);
        });
        setTaskData(sorted);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTaskData();
  }, [token]);

  const getStatus = (task) => {
    if (task.status === "completed") return "completed";
    if (task.dueDate && new Date(task.dueDate) < Date.now()) return "expired";
    return "pending";
  };

  const filtered = taskData.filter((t) => {
    const matchSearch =
      t.taskName?.toLowerCase().includes(search.toLowerCase()) ||
      t.assignTo?.username?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" ? true : getStatus(t) === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all: taskData.length,
    pending: taskData.filter((t) => getStatus(t) === "pending").length,
    completed: taskData.filter((t) => getStatus(t) === "completed").length,
    expired: taskData.filter((t) => getStatus(t) === "expired").length,
  };

  const cardStyle = {
    background: "linear-gradient(145deg,#0d1424,#080d18)",
    border: "1px solid rgba(255,255,255,0.06)",
  };

  return (
    <div className="flex min-h-screen bg-[#080C14]">
      <AdminSidebar />
      <div className="md:ml-64 flex-1 px-4 md:px-10 pt-16 md:pt-8 pb-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(14,165,233,0.12)" }}
          >
            <History size={18} style={{ color: "#38bdf8" }} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white/90">
              Task History
            </h1>
            <p className="text-sm text-white/35 mt-0.5">
              All assigned tasks across your team
            </p>
          </div>
        </div>

        {/* Stat pills — iterate STAT_PILLS, look up count by key */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STAT_PILLS.map((pill) => (
            <div
              key={pill.key}
              className="rounded-xl px-4 py-3 cursor-pointer transition-all"
              onClick={() => setFilter(pill.key)}
              style={{
                ...cardStyle,
                border:
                  filter === pill.key
                    ? `1px solid ${pill.color}44`
                    : "1px solid rgba(255,255,255,0.06)",
                boxShadow:
                  filter === pill.key ? `0 0 12px ${pill.color}18` : "none",
              }}
            >
              <p className="text-[11px] text-white/35">{pill.label}</p>
              <p
                className="text-2xl font-semibold mt-0.5"
                style={{ color: pill.color }}
              >
                {counts[pill.key]}
              </p>
            </div>
          ))}
        </div>

        {/* Search + filter tabs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl flex-1"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <Search size={14} style={{ color: "rgba(255,255,255,0.25)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks or employees..."
              className="flex-1 bg-transparent text-sm text-white/80 placeholder-white/25 outline-none"
            />
          </div>
          <div
            className="flex gap-1 p-1 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {STAT_PILLS.map((pill) => (
              <button
                key={pill.key}
                onClick={() => setFilter(pill.key)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
                style={
                  filter === pill.key
                    ? { background: "rgba(14,165,233,0.2)", color: "#38bdf8" }
                    : { color: "rgba(255,255,255,0.35)" }
                }
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table / list */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="rounded-2xl h-14 animate-pulse"
                style={{ background: "rgba(255,255,255,0.03)" }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="rounded-2xl py-14 flex flex-col items-center gap-3"
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <ListTodo size={28} className="text-white/20" />
            <p className="text-sm text-white/30">No tasks found</p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={cardStyle}>
            {/* Table head — desktop only */}
            <div
              className="hidden md:grid grid-cols-5 px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div className="col-span-2">Task Name</div>
              <div className="text-center">Assigned To</div>
              <div className="text-center">Due Date</div>
              <div className="text-center">Status</div>
            </div>

            <div
              className="divide-y"
              style={{ borderColor: "rgba(255,255,255,0.04)" }}
            >
              {filtered.map((task) => {
                const status = getStatus(task);
                const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
                const Icon = cfg.Icon;

                return (
                  <div
                    key={task._id}
                    className="px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Mobile layout */}
                    <div className="flex flex-col gap-2 md:hidden">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white/80 capitalize">
                          {task.taskName}
                        </p>
                        <span
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium"
                          style={{ color: cfg.color, background: cfg.bg }}
                        >
                          <Icon size={10} strokeWidth={2.5} />
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex gap-4 text-xs text-white/35">
                        <span>{task.assignTo?.username || "—"}</span>
                        <span>
                          {task.dueDate ? task.dueDate.slice(0, 10) : "—"}
                        </span>
                      </div>
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden md:grid grid-cols-5 items-center">
                      <div className="col-span-2 text-sm font-medium text-white/80 capitalize truncate pr-4">
                        {task.taskName}
                      </div>
                      <div className="text-center text-sm text-white/55 capitalize">
                        {task.assignTo?.username || "—"}
                      </div>
                      <div className="text-center text-sm text-white/35">
                        {task.dueDate ? task.dueDate.slice(0, 10) : "—"}
                      </div>
                      <div className="flex justify-center">
                        <span
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium"
                          style={{ color: cfg.color, background: cfg.bg }}
                        >
                          <Icon size={11} strokeWidth={2.5} />
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskHistory;
