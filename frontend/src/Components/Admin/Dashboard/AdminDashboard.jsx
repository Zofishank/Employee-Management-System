import React, { useEffect, useState } from "react";
import AdminSidebar from "../SidebarMenu/AdminSidebar";
import {
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  Plus,
  ChevronRight,
  BarChart3,
  Activity,
  Star,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ── Appreciation modal ── */
const AppreciationModal = ({ employee, onClose, onSent }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const token = localStorage.getItem("token");

  const presets = [
    "🌟 Outstanding work this week! Your dedication is truly inspiring.",
    "🎉 Exceptional performance! You've gone above and beyond expectations.",
    "🚀 Your hard work and commitment is making a real difference. Keep it up!",
    "💪 You're a star employee! Your efforts don't go unnoticed.",
    "🏆 Incredible achievement! You've set the standard for excellence.",
  ];

  const send = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      await fetch(`${BASE_URL}/api/appreciation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: employee._id, message: message.trim() }),
      });
      onSent();
      onClose();
    } catch (_err) {
      /* silent */
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "linear-gradient(145deg,#0d1424,#080d18)",
          border: "1px solid rgba(168,85,247,0.25)",
          borderRadius: 20,
          padding: 28,
          boxShadow: "0 0 60px rgba(99,102,241,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "rgba(251,191,36,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Star size={18} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
            </div>
            <div>
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.9)",
                  margin: 0,
                }}
              >
                Appreciate Employee
              </h3>
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.35)",
                  margin: 0,
                }}
              >
                {employee.username}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.3)",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Preset messages */}
        <p
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.35)",
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Quick messages
        </p>
        <div className="flex flex-col gap-2 mb-4">
          {presets.map((p, i) => (
            <button
              key={i}
              onClick={() => setMessage(p)}
              style={{
                textAlign: "left",
                padding: "8px 12px",
                borderRadius: 10,
                fontSize: 12,
                color: message === p ? "#a78bfa" : "rgba(255,255,255,0.5)",
                background:
                  message === p
                    ? "rgba(168,85,247,0.12)"
                    : "rgba(255,255,255,0.02)",
                border: `1px solid ${message === p ? "rgba(168,85,247,0.3)" : "rgba(255,255,255,0.06)"}`,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Custom message */}
        <p
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.35)",
            marginBottom: 6,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Or write custom
        </p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a personal appreciation message..."
          rows={3}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.85)",
            fontSize: 13,
            resize: "none",
            outline: "none",
            fontFamily: "inherit",
            boxSizing: "border-box",
          }}
        />

        {/* Send button */}
        <button
          onClick={send}
          disabled={!message.trim() || sending}
          style={{
            marginTop: 14,
            width: "100%",
            padding: "11px",
            borderRadius: 12,
            border: "none",
            cursor: message.trim() ? "pointer" : "default",
            background: message.trim()
              ? "linear-gradient(135deg,#a855f7,#6366f1)"
              : "rgba(255,255,255,0.06)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            opacity: !message.trim() || sending ? 0.5 : 1,
          }}
        >
          <Send size={15} />
          {sending ? "Sending..." : "Send Appreciation"}
        </button>
      </div>
    </div>
  );
};

/* ── Stat card ── */
const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div
    className="rounded-2xl p-5 flex flex-col gap-3"
    style={{
      background: "linear-gradient(145deg,#0d1424,#080d18)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}
  >
    <div className="flex items-center justify-between">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${color}18` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      {sub && (
        <span
          className="text-xs px-2 py-1 rounded-lg"
          style={{
            background: "rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          {sub}
        </span>
      )}
    </div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-white/35 mt-0.5">{label}</p>
    </div>
  </div>
);

/* ══════════════════════════════════════════════ */
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [appreciated, setAppreciated] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchStats = () => {
    fetch(`${BASE_URL}/api/performance/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  /* Check if top employee already has appreciation */
  useEffect(() => {
    if (!stats?.topEmployee?._id) return;
    fetch(`${BASE_URL}/api/appreciation/${stats.topEmployee._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setAppreciated(!!d?.message))
      .catch(() => {});
  }, [stats?.topEmployee?._id]);

  const removeAppreciation = async () => {
    if (!stats?.topEmployee?._id) return;
    await fetch(`${BASE_URL}/api/appreciation/${stats.topEmployee._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setAppreciated(false);
  };

  const getTimeGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const priorityColor = { high: "#f87171", medium: "#fbbf24", low: "#34d399" };

  return (
    <div className="flex min-h-screen bg-[#080C14]">
      <AdminSidebar />

      {/* Appreciation modal */}
      {modalOpen && stats?.topEmployee && (
        <AppreciationModal
          employee={stats.topEmployee}
          onClose={() => setModalOpen(false)}
          onSent={() => setAppreciated(true)}
        />
      )}

      <div className="md:ml-64 flex-1 px-4 md:px-10 pt-16 md:pt-8 pb-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white/90">
              {getTimeGreeting()}, {user.username || "Admin"} 👋
            </h1>
            <p className="text-sm text-white/35 mt-0.5">
              Here's what's happening at WorkHub today
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/add-task")}
            className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white"
            style={{ background: "linear-gradient(135deg,#3b82f6,#6366f1)" }}
          >
            <Plus size={15} /> Assign Task
          </button>
        </div>

        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg,transparent,rgba(99,102,241,0.3),transparent)",
          }}
        />

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="rounded-2xl h-28 animate-pulse"
                style={{ background: "rgba(255,255,255,0.03)" }}
              />
            ))}
          </div>
        ) : (
          stats && (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  icon={Users}
                  label="Total Employees"
                  value={stats.totalEmployees}
                  color="#60a5fa"
                  sub="Active"
                />
                <StatCard
                  icon={BarChart3}
                  label="Total Tasks"
                  value={stats.totalTasks}
                  color="#a78bfa"
                  sub="All time"
                />
                <StatCard
                  icon={CheckCircle2}
                  label="Completed"
                  value={stats.completedTasks}
                  color="#34d399"
                  sub={`${stats.completionRate}%`}
                />
                <StatCard
                  icon={Clock}
                  label="Pending"
                  value={stats.pendingTasks}
                  color="#f87171"
                  sub="In progress"
                />
              </div>

              {/* Completion bar */}
              <div
                className="rounded-2xl p-5"
                style={{
                  background: "linear-gradient(145deg,#0d1424,#080d18)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Activity size={16} style={{ color: "#60a5fa" }} />
                    <span className="text-sm font-medium text-white/80">
                      Overall Completion Rate
                    </span>
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{ color: "#60a5fa" }}
                  >
                    {stats.completionRate}%
                  </span>
                </div>
                <div
                  className="h-2 rounded-full"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${stats.completionRate}%`,
                      background: "linear-gradient(90deg,#3b82f6,#6366f1)",
                    }}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Recent Tasks */}
                <div
                  className="rounded-2xl p-5 flex flex-col gap-4"
                  style={{
                    background: "linear-gradient(145deg,#0d1424,#080d18)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={16} style={{ color: "#a78bfa" }} />
                      <span className="text-sm font-medium text-white/80">
                        Recent Tasks
                      </span>
                    </div>
                    <button
                      onClick={() => navigate("/admin/task-history")}
                      className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition"
                    >
                      View all <ChevronRight size={12} />
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {(stats.recentTasks || []).length === 0 ? (
                      <p className="text-sm text-white/25 py-4 text-center">
                        No tasks yet
                      </p>
                    ) : (
                      (stats.recentTasks || []).map((task) => (
                        <div
                          key={task._id}
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                          style={{
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.04)",
                          }}
                        >
                          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                            <span className="text-sm text-white/75 truncate">
                              {task.taskName}
                            </span>
                            <span className="text-xs text-white/30">
                              {task.assignToUserId?.username || "Unassigned"} ·{" "}
                              {formatDate(task.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 ml-3">
                            <span
                              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                              style={{
                                background: `${priorityColor[task.priority] || "#fbbf24"}18`,
                                color:
                                  priorityColor[task.priority] || "#fbbf24",
                              }}
                            >
                              {task.priority}
                            </span>
                            <span
                              className="text-[10px] px-2 py-0.5 rounded-full"
                              style={{
                                background:
                                  task.status === "completed"
                                    ? "rgba(52,211,153,0.1)"
                                    : "rgba(251,191,36,0.1)",
                                color:
                                  task.status === "completed"
                                    ? "#34d399"
                                    : "#fbbf24",
                              }}
                            >
                              {task.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Right column */}
                <div className="flex flex-col gap-4">
                  {/* ── TOP PERFORMER with Appreciate button ── */}
                  {stats.topEmployee && (
                    <div
                      className="rounded-2xl p-5"
                      style={{
                        background: "linear-gradient(145deg,#0d1424,#080d18)",
                        border: appreciated
                          ? "1px solid rgba(168,85,247,0.35)"
                          : "1px solid rgba(255,255,255,0.06)",
                        transition: "border-color 0.3s",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Award size={16} style={{ color: "#fbbf24" }} />
                        <span className="text-sm font-medium text-white/80">
                          Top Performer
                        </span>
                        {appreciated && (
                          <span
                            className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-medium"
                            style={{
                              background: "rgba(168,85,247,0.15)",
                              color: "#a78bfa",
                            }}
                          >
                            ✓ Appreciated
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                          style={{
                            background: "rgba(251,191,36,0.15)",
                            color: "#fbbf24",
                          }}
                        >
                          {stats.topEmployee.username
                            ?.slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white/85 capitalize">
                            {stats.topEmployee.username}
                          </p>
                          <p className="text-xs text-white/35">
                            {stats.topEmployee.email}
                          </p>
                        </div>
                        <span className="ml-auto text-xl">🏆</span>
                      </div>

                      {/* Appreciate / Remove buttons */}
                      <div className="flex gap-2">
                        {!appreciated ? (
                          <button
                            onClick={() => setModalOpen(true)}
                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition"
                            style={{
                              background:
                                "linear-gradient(135deg,rgba(168,85,247,0.2),rgba(99,102,241,0.2))",
                              color: "#a78bfa",
                              border: "1px solid rgba(168,85,247,0.25)",
                            }}
                          >
                            <Star size={14} style={{ fill: "currentColor" }} />
                            Appreciate
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => setModalOpen(true)}
                              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition"
                              style={{
                                background: "rgba(168,85,247,0.1)",
                                color: "#a78bfa",
                                border: "1px solid rgba(168,85,247,0.2)",
                              }}
                            >
                              <Send size={13} />
                              Update Message
                            </button>
                            <button
                              onClick={removeAppreciation}
                              className="flex items-center justify-center px-3 py-2 rounded-xl transition"
                              style={{
                                background: "rgba(239,68,68,0.08)",
                                color: "#f87171",
                                border: "1px solid rgba(239,68,68,0.15)",
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div
                    className="rounded-2xl p-5"
                    style={{
                      background: "linear-gradient(145deg,#0d1424,#080d18)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp size={16} style={{ color: "#34d399" }} />
                      <span className="text-sm font-medium text-white/80">
                        Quick Actions
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {[
                        {
                          label: "Assign New Task",
                          path: "/admin/add-task",
                          color: "#3b82f6",
                        },
                        {
                          label: "View All Employees",
                          path: "/admin/employees",
                          color: "#a78bfa",
                        },
                        {
                          label: "Employee Performance",
                          path: "/admin/performance",
                          color: "#34d399",
                        },
                        {
                          label: "Task History",
                          path: "/admin/task-history",
                          color: "#fbbf24",
                        },
                      ].map(({ label, path, color }) => (
                        <button
                          key={path}
                          onClick={() => navigate(path)}
                          className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm text-white/70 hover:text-white/90 transition"
                          style={{
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.04)",
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ background: color }}
                            />
                            {label}
                          </div>
                          <ChevronRight size={14} className="text-white/25" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
