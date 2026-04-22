import React, { useEffect, useState } from "react";
import AdminSidebar from "../SidebarMenu/AdminSidebar";
import {
  Users, CheckCircle2, Clock, TrendingUp,
  Award, Plus, ChevronRight, BarChart3, Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="rounded-2xl p-5 flex flex-col gap-3" style={{
    background: "linear-gradient(145deg,#0d1424,#080d18)",
    border: "1px solid rgba(255,255,255,0.06)"
  }}>
    <div className="flex items-center justify-between">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${color}18` }}>
        <Icon size={18} style={{ color }} />
      </div>
      {sub && <span className="text-xs px-2 py-1 rounded-lg"
        style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)" }}>
        {sub}
      </span>}
    </div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-white/35 mt-0.5">{label}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetch(`${API}/api/performance/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getTimeGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-US", {
    month: "short", day: "numeric"
  });

  const priorityColor = { high: "#f87171", medium: "#fbbf24", low: "#34d399" };

  return (
    <div className="flex min-h-screen bg-[#080C14]">
      <AdminSidebar />
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
            className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition"
            style={{ background: "linear-gradient(135deg,#3b82f6,#6366f1)" }}
          >
            <Plus size={15} /> Assign Task
          </button>
        </div>

        {/* Accent line */}
        <div className="h-px w-full" style={{
          background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.3),transparent)"
        }} />

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(n => (
              <div key={n} className="rounded-2xl h-28 animate-pulse"
                style={{ background: "rgba(255,255,255,0.03)" }} />
            ))}
          </div>
        ) : stats && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Users} label="Total Employees" value={stats.totalEmployees}
                color="#60a5fa" sub="Active" />
              <StatCard icon={BarChart3} label="Total Tasks" value={stats.totalTasks}
                color="#a78bfa" sub="All time" />
              <StatCard icon={CheckCircle2} label="Completed" value={stats.completedTasks}
                color="#34d399" sub={`${stats.completionRate}%`} />
              <StatCard icon={Clock} label="Pending" value={stats.pendingTasks}
                color="#f87171" sub="In progress" />
            </div>

            {/* Completion Rate Bar */}
            <div className="rounded-2xl p-5" style={{
              background: "linear-gradient(145deg,#0d1424,#080d18)",
              border: "1px solid rgba(255,255,255,0.06)"
            }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity size={16} style={{ color: "#60a5fa" }} />
                  <span className="text-sm font-medium text-white/80">Overall Completion Rate</span>
                </div>
                <span className="text-sm font-bold" style={{ color: "#60a5fa" }}>
                  {stats.completionRate}%
                </span>
              </div>
              <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${stats.completionRate}%`,
                    background: "linear-gradient(90deg,#3b82f6,#6366f1)"
                  }} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Tasks */}
              <div className="rounded-2xl p-5 flex flex-col gap-4" style={{
                background: "linear-gradient(145deg,#0d1424,#080d18)",
                border: "1px solid rgba(255,255,255,0.06)"
              }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={16} style={{ color: "#a78bfa" }} />
                    <span className="text-sm font-medium text-white/80">Recent Tasks</span>
                  </div>
                  <button onClick={() => navigate("/admin/task-history")}
                    className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition">
                    View all <ChevronRight size={12} />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {stats.recentTasks.length === 0 ? (
                    <p className="text-sm text-white/25 py-4 text-center">No tasks yet</p>
                  ) : stats.recentTasks.map(task => (
                    <div key={task._id} className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <span className="text-sm text-white/75 truncate">{task.taskName}</span>
                        <span className="text-xs text-white/30">
                          {task.assignToUserId?.username || "Unassigned"} · {formatDate(task.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: `${priorityColor[task.priority] || "#fbbf24"}18`,
                            color: priorityColor[task.priority] || "#fbbf24"
                          }}>
                          {task.priority}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{
                            background: task.status === "completed" ? "rgba(52,211,153,0.1)" : "rgba(251,191,36,0.1)",
                            color: task.status === "completed" ? "#34d399" : "#fbbf24"
                          }}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Employee + Quick Actions */}
              <div className="flex flex-col gap-4">
                {/* Top Employee */}
                {stats.topEmployee && (
                  <div className="rounded-2xl p-5" style={{
                    background: "linear-gradient(145deg,#0d1424,#080d18)",
                    border: "1px solid rgba(255,255,255,0.06)"
                  }}>
                    <div className="flex items-center gap-2 mb-4">
                      <Award size={16} style={{ color: "#fbbf24" }} />
                      <span className="text-sm font-medium text-white/80">Top Performer</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                        style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>
                        {stats.topEmployee.username?.slice(0,2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white/85 capitalize">
                          {stats.topEmployee.username}
                        </p>
                        <p className="text-xs text-white/35">{stats.topEmployee.email}</p>
                      </div>
                      <span className="ml-auto text-xl">🏆</span>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="rounded-2xl p-5" style={{
                  background: "linear-gradient(145deg,#0d1424,#080d18)",
                  border: "1px solid rgba(255,255,255,0.06)"
                }}>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={16} style={{ color: "#34d399" }} />
                    <span className="text-sm font-medium text-white/80">Quick Actions</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: "Assign New Task", path: "/admin/add-task", color: "#3b82f6" },
                      { label: "View All Employees", path: "/admin/employees", color: "#a78bfa" },
                      { label: "Employee Performance", path: "/admin/performance", color: "#34d399" },
                      { label: "Task History", path: "/admin/task-history", color: "#fbbf24" },
                    ].map(({ label, path, color }) => (
                      <button key={path} onClick={() => navigate(path)}
                        className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm text-white/70 hover:text-white/90 transition"
                        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
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
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
