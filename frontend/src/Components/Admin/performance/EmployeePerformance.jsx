import React, { useEffect, useState } from "react";
import AdminSidebar from "../SidebarMenu/AdminSidebar";
import { TrendingUp, Award, CheckCircle2, Clock, AlertTriangle, X, ChevronLeft } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL + "";

const buildAvatarURL = (avatar) => {
  if (!avatar) return "";
  if (avatar.startsWith("http")) return avatar;
  return `${BASE_URL}${avatar}`;
};

const getInitials = (name) => (name ? name.slice(0, 2).toUpperCase() : "?");

const PerfAvatar = ({ user, color, size = 36 }) => {
  const [err, setErr] = useState(false);
  const url = buildAvatarURL(user?.avatar);
  const name = user?.username || "?";
  return (
    <div style={{ width: size, height: size, minWidth: size, minHeight: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {url && !err ? (
        <img src={url} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={() => setErr(true)} />
      ) : (
        <span style={{ fontSize: size * 0.36, fontWeight: 700, color, lineHeight: 1 }}>{getInitials(name)}</span>
      )}
    </div>
  );
};

const getLevel = (pct) => {
  if (pct >= 90) return { label: "Expert", color: "#fbbf24" };
  if (pct >= 70) return { label: "Advanced", color: "#34d399" };
  if (pct >= 40) return { label: "Intermediate", color: "#60a5fa" };
  return { label: "Beginner", color: "#a78bfa" };
};

const isOverdue = (task) => {
  if (!task.dueDate || task.status === "completed") return false;
  return new Date(task.dueDate) < new Date();
};

const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "No date";

const statusStyle = (task) => {
  if (task.status === "completed") return { bg: "rgba(52,211,153,0.1)", color: "#34d399", label: "Completed" };
  if (isOverdue(task)) return { bg: "rgba(248,113,113,0.1)", color: "#f87171", label: "Overdue" };
  return { bg: "rgba(251,191,36,0.1)", color: "#fbbf24", label: "Pending" };
};

const priorityColor = { high: "#f87171", medium: "#fbbf24", low: "#34d399" };

const Performance = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeTasks, setEmployeeTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [perfRes, usersRes] = await Promise.all([
          fetch(`${BASE_URL}/api/performance`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${BASE_URL}/api/users`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const [perfData, usersData] = await Promise.all([perfRes.json(), usersRes.json()]);
        if (Array.isArray(usersData)) {
          const map = {};
          usersData.forEach((u) => { map[u._id] = u; });
          setUserProfiles(map);
        }
        if (Array.isArray(perfData)) {
          const sorted = [...perfData].sort((a, b) => {
            const tA = a.completed + a.pending;
            const tB = b.completed + b.pending;
            return (tB === 0 ? 0 : b.completed / tB) - (tA === 0 ? 0 : a.completed / tA);
          });
          setPerformanceData(sorted);
        }
      } catch (err) {
        console.error("Error fetching performance:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [token]);

  const handleEmployeeClick = async (emp) => {
    setSelectedEmployee(emp);
    setTasksLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/tasks/user/${emp.user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEmployeeTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setEmployeeTasks([]);
    } finally {
      setTasksLoading(false);
    }
  };

  const cardStyle = { background: "linear-gradient(145deg,#0d1424,#080d18)", border: "1px solid rgba(255,255,255,0.06)" };

  // Employee Task Drill-down View
  if (selectedEmployee) {
    const total = selectedEmployee.completed + selectedEmployee.pending;
    const pct = total === 0 ? 0 : Math.round((selectedEmployee.completed / total) * 100);
    const level = getLevel(pct);
    const profile = userProfiles[selectedEmployee.user._id] || selectedEmployee.user;
    const overdueTasks = employeeTasks.filter(isOverdue);

    return (
      <div className="flex min-h-screen bg-[#080C14]">
        <AdminSidebar />
        <div className="md:ml-64 flex-1 px-4 md:px-10 pt-16 md:pt-8 pb-8 flex flex-col gap-6">
          {/* Back button */}
          <button onClick={() => setSelectedEmployee(null)}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition w-fit">
            <ChevronLeft size={16} /> Back to Performance
          </button>

          {/* Employee header */}
          <div className="rounded-2xl p-5 flex items-center gap-4" style={cardStyle}>
            <PerfAvatar user={profile} color={level.color} size={52} />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-white/90 capitalize">{selectedEmployee.user.username}</h2>
              <p className="text-xs text-white/35">{profile.email}</p>
              <span className="text-xs mt-1 flex items-center gap-1" style={{ color: level.color }}>
                <Award size={10} /> {level.label}
              </span>
            </div>
            <div className="flex gap-4 text-center">
              <div>
                <p className="text-xl font-bold" style={{ color: "#34d399" }}>{selectedEmployee.completed}</p>
                <p className="text-[10px] text-white/30">Done</p>
              </div>
              <div>
                <p className="text-xl font-bold" style={{ color: "#fbbf24" }}>{selectedEmployee.pending}</p>
                <p className="text-[10px] text-white/30">Pending</p>
              </div>
              {overdueTasks.length > 0 && (
                <div>
                  <p className="text-xl font-bold" style={{ color: "#f87171" }}>{overdueTasks.length}</p>
                  <p className="text-[10px] text-white/30">Overdue</p>
                </div>
              )}
              <div>
                <p className="text-xl font-bold" style={{ color: level.color }}>{pct}%</p>
                <p className="text-[10px] text-white/30">Rate</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="rounded-2xl p-4" style={cardStyle}>
            <div className="flex justify-between text-xs text-white/40 mb-2">
              <span>Completion Rate</span>
              <span style={{ color: level.color }}>{pct}%</span>
            </div>
            <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${pct}%`, background: level.color }} />
            </div>
          </div>

          {/* Tasks list */}
          <div className="rounded-2xl overflow-hidden" style={cardStyle}>
            <div className="px-5 py-3 flex items-center justify-between"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <h3 className="text-sm font-medium text-white/80">All Tasks ({employeeTasks.length})</h3>
              {overdueTasks.length > 0 && (
                <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
                  style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}>
                  <AlertTriangle size={10} /> {overdueTasks.length} overdue
                </span>
              )}
            </div>
            {tasksLoading ? (
              <div className="flex flex-col gap-2 p-4">
                {[1,2,3].map(n => (
                  <div key={n} className="h-14 rounded-xl animate-pulse"
                    style={{ background: "rgba(255,255,255,0.03)" }} />
                ))}
              </div>
            ) : employeeTasks.length === 0 ? (
              <div className="py-10 text-center text-sm text-white/25">No tasks assigned yet</div>
            ) : (
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                {employeeTasks.map(task => {
                  const s = statusStyle(task);
                  return (
                    <div key={task._id} className="px-5 py-3 flex items-center gap-3 hover:bg-white/[0.02] transition">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/80 truncate">{task.taskName}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-[10px] text-white/30">Due: {formatDate(task.dueDate)}</span>
                          {isOverdue(task) && (
                            <span className="flex items-center gap-0.5 text-[10px]" style={{ color: "#f87171" }}>
                              <AlertTriangle size={9} /> Overdue
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
                        style={{ background: `${priorityColor[task.priority]}18`, color: priorityColor[task.priority] }}>
                        {task.priority}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
                        style={{ background: s.bg, color: s.color }}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#080C14]">
      <AdminSidebar />
      <div className="md:ml-64 flex-1 px-4 md:px-10 pt-16 md:pt-8 pb-8 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(14,165,233,0.12)" }}>
            <TrendingUp size={18} style={{ color: "#38bdf8" }} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white/90">Employee Performance</h1>
            <p className="text-sm text-white/35 mt-0.5">Click an employee to view their tasks</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1,2,3,4].map((n) => (
              <div key={n} className="rounded-2xl h-20 animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />
            ))}
          </div>
        ) : performanceData.length === 0 ? (
          <div className="rounded-2xl py-14 flex flex-col items-center gap-3"
            style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <TrendingUp size={28} className="text-white/20" />
            <p className="text-sm text-white/30">No performance data available</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block rounded-2xl overflow-hidden" style={cardStyle}>
              <div className="grid grid-cols-6 px-6 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="col-span-2">Employee</div>
                <div className="text-center">Completed</div>
                <div className="text-center">Pending</div>
                <div className="text-center">Overdue</div>
                <div className="text-center">Progress</div>
              </div>
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                {performanceData.map((emp, i) => {
                  const total = emp.completed + emp.pending;
                  const pct = total === 0 ? 0 : Math.round((emp.completed / total) * 100);
                  const level = getLevel(pct);
                  const isTop = i === 0;
                  const profile = userProfiles[emp.user._id] || emp.user;
                  const overdue = emp.overdue || 0;

                  return (
                    <div key={emp.user._id}
                      className="grid grid-cols-6 items-center px-6 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
                      onClick={() => handleEmployeeClick(emp)}>
                      <div className="col-span-2 flex items-center gap-3">
                        <span className="text-xs font-bold w-5 text-center"
                          style={{ color: isTop ? "#fbbf24" : "rgba(255,255,255,0.2)" }}>
                          {isTop ? "🥇" : `#${i + 1}`}
                        </span>
                        <PerfAvatar user={profile} color={level.color} size={34} />
                        <div>
                          <p className="text-sm font-medium text-white/80 capitalize">{emp.user.username}</p>
                          <span className="flex items-center gap-1 text-[10px]" style={{ color: level.color }}>
                            <Award size={10} /> {level.label}
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="flex items-center justify-center gap-1 text-sm font-semibold" style={{ color: "#34d399" }}>
                          <CheckCircle2 size={13} strokeWidth={2.5} /> {emp.completed}
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="flex items-center justify-center gap-1 text-sm font-semibold" style={{ color: "#fbbf24" }}>
                          <Clock size={13} strokeWidth={2.5} /> {emp.pending}
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="flex items-center justify-center gap-1 text-sm font-semibold" style={{ color: overdue > 0 ? "#f87171" : "rgba(255,255,255,0.2)" }}>
                          <AlertTriangle size={13} strokeWidth={2.5} /> {overdue}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 pr-2">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden"
                          style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${pct}%`, background: level.color }} />
                        </div>
                        <span className="text-xs font-semibold shrink-0 w-9 text-right" style={{ color: level.color }}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden flex flex-col gap-3">
              {performanceData.map((emp, i) => {
                const total = emp.completed + emp.pending;
                const pct = total === 0 ? 0 : Math.round((emp.completed / total) * 100);
                const level = getLevel(pct);
                const profile = userProfiles[emp.user._id] || emp.user;
                const overdue = emp.overdue || 0;
                return (
                  <div key={emp.user._id} className="rounded-2xl p-4 flex flex-col gap-3 cursor-pointer"
                    style={cardStyle} onClick={() => handleEmployeeClick(emp)}>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold w-5 text-center"
                        style={{ color: i === 0 ? "#fbbf24" : "rgba(255,255,255,0.2)" }}>
                        {i === 0 ? "🥇" : `#${i + 1}`}
                      </span>
                      <PerfAvatar user={profile} color={level.color} size={36} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white/80 capitalize">{emp.user.username}</p>
                        <span className="text-[10px]" style={{ color: level.color }}>{level.label}</span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: level.color }}>{pct}%</span>
                    </div>
                    <div className="flex gap-4 text-xs">
                      <span className="flex items-center gap-1" style={{ color: "#34d399" }}>
                        <CheckCircle2 size={11} /> {emp.completed} done
                      </span>
                      <span className="flex items-center gap-1" style={{ color: "#fbbf24" }}>
                        <Clock size={11} /> {emp.pending} pending
                      </span>
                      {overdue > 0 && (
                        <span className="flex items-center gap-1" style={{ color: "#f87171" }}>
                          <AlertTriangle size={11} /> {overdue} overdue
                        </span>
                      )}
                    </div>
                    <div className="h-1.5 rounded-full w-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: level.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Performance;
