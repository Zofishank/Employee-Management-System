import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  ListTodo,
  ChevronRight,
} from "lucide-react";
import axios from "axios";

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

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
  { key: "expired", label: "Overdue" },
];

const STAT_COLORS = {
  all: { color: "#a78bfa", bg: "rgba(167,139,250,0.08)" },
  pending: { color: "#60a5fa", bg: "rgba(96,165,250,0.08)" },
  completed: { color: "#34d399", bg: "rgba(52,211,153,0.08)" },
  expired: { color: "#f87171", bg: "rgba(248,113,113,0.08)" },
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  const getTaskStatus = (task) => {
    if (task.status === "completed") return "completed";
    if (task.dueDate && new Date(task.dueDate) < Date.now()) return "expired";
    return "pending";
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
        params: { assignedToMe: true },
      });
      setTasks(res.data || []);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  /* Toggle status — optimistic update, stops click bubbling to Link */
  const toggleStatus = async (e, taskId, currentStatus) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentStatus === "expired") return;
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)),
    );
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/update/${taskId}`,
        { status: newStatus },
        axiosConfig,
      );
    } catch {
      fetchTasks();
    }
  };

  useEffect(() => {
    fetchTasks();
    const iv = setInterval(fetchTasks, 60000);
    return () => clearInterval(iv);
  }, []);

  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => getTaskStatus(t) === "pending").length,
    completed: tasks.filter((t) => getTaskStatus(t) === "completed").length,
    expired: tasks.filter((t) => getTaskStatus(t) === "expired").length,
  };

  const filteredTasks = tasks.filter((t) =>
    filter === "all" ? true : getTaskStatus(t) === filter,
  );

  return (
    <div className="md:ml-64 min-h-screen bg-[#080C14] px-4 md:px-10 pt-16 md:pt-8 pb-8 flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-white/90">My Tasks</h1>
        <p className="text-sm text-white/35 mt-1">
          Track and manage your assigned work
        </p>
      </div>

      {/* Stat pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {FILTERS.map(({ key, label }) => {
          const { color, bg } = STAT_COLORS[key];
          return (
            <div
              key={key}
              className="rounded-xl px-4 py-3 cursor-pointer transition-all"
              onClick={() => setFilter(key)}
              style={{
                background: "linear-gradient(145deg,#0d1424,#080d18)",
                border:
                  filter === key ? `1px solid ${color}44` : `1px solid ${bg}`,
                boxShadow: filter === key ? `0 0 12px ${color}18` : "none",
              }}
            >
              <p className="text-[11px] text-white/35">{label}</p>
              <p className="text-2xl font-semibold mt-0.5" style={{ color }}>
                {counts[key]}
              </p>
            </div>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl w-fit"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className="px-3 md:px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={
              filter === key
                ? { background: "rgba(99,102,241,0.2)", color: "#a78bfa" }
                : { color: "rgba(255,255,255,0.35)" }
            }
          >
            {label}
            <span className="ml-1.5 text-[10px] opacity-60">{counts[key]}</span>
          </button>
        ))}
      </div>

      {/* Task list */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="rounded-2xl h-16 animate-pulse"
              style={{ background: "rgba(255,255,255,0.03)" }}
            />
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div
          className="rounded-2xl py-14 flex flex-col items-center gap-3"
          style={{
            background: "rgba(255,255,255,0.015)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <ListTodo size={28} className="text-white/20" />
          <p className="text-sm text-white/30">
            No {filter === "all" ? "" : filter} tasks found
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filteredTasks.map((task) => {
            const status = getTaskStatus(task);
            const cfg = STATUS_CONFIG[status];
            const { Icon } = cfg;
            const isCompleted = status === "completed";
            const isExpired = status === "expired";

            return (
              /* Entire row is a link to task detail */
              <Link
                key={task._id}
                to={`/employee/tasks/${task._id}`}
                className="group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200"
                style={{
                  background: "linear-gradient(145deg,#0d1424,#080d18)",
                  border: `1px solid ${isExpired ? "rgba(248,113,113,0.12)" : "rgba(255,255,255,0.05)"}`,
                  opacity: isCompleted ? 0.75 : 1,
                  textDecoration: "none",
                }}
              >
                {/* Checkbox toggle — stops propagation so it doesn't open detail */}
                <button
                  onClick={(e) => toggleStatus(e, task._id, status)}
                  disabled={isExpired}
                  className="shrink-0 transition-transform hover:scale-110 disabled:cursor-not-allowed z-10"
                >
                  {isCompleted ? (
                    <CheckCircle2 size={20} style={{ color: "#34d399" }} />
                  ) : isExpired ? (
                    <AlertTriangle size={20} style={{ color: "#f87171" }} />
                  ) : (
                    <Circle
                      size={20}
                      style={{ color: "rgba(255,255,255,0.2)" }}
                    />
                  )}
                </button>

                {/* Task info */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{
                      color: isCompleted
                        ? "rgba(255,255,255,0.35)"
                        : "rgba(255,255,255,0.85)",
                      textDecoration: isCompleted ? "line-through" : "none",
                    }}
                  >
                    {task.taskName}
                  </p>
                  {task.dueDate && (
                    <p
                      className="text-[11px] mt-0.5"
                      style={{
                        color: isExpired ? "#f87171" : "rgba(255,255,255,0.25)",
                      }}
                    >
                      {isExpired ? "Was due " : "Due "}
                      {new Date(task.dueDate).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>

                {/* Status badge */}
                <span
                  className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium"
                  style={{ color: cfg.color, background: cfg.bg }}
                >
                  <Icon size={11} strokeWidth={2.5} />
                  {cfg.label}
                </span>

                {/* Arrow hint */}
                <ChevronRight
                  size={14}
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Tasks;
