import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Award,
  Flame,
  Target,
} from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import EmployeeSidebar from "../SidebarMenu/EmployeeSidebar";

const MyProgress = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + "/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch {
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [token]);

  const now = new Date();
  const total = tasks.length;
  const completed = tasks.filter(
    (t) => t.status?.toLowerCase() === "completed",
  ).length;
  const pending = tasks.filter(
    (t) =>
      t.status?.toLowerCase() !== "completed" && new Date(t.dueDate) >= now,
  ).length;
  const overdue = tasks.filter(
    (t) => t.status?.toLowerCase() !== "completed" && new Date(t.dueDate) < now,
  ).length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  const getLevel = (p) => {
    if (p >= 90) return { label: "Expert", color: "#fbbf24" };
    if (p >= 70) return { label: "Advanced", color: "#34d399" };
    if (p >= 40) return { label: "Intermediate", color: "#60a5fa" };
    return { label: "Beginner", color: "#a78bfa" };
  };
  const level = getLevel(pct);

  const stats = [
    {
      label: "Completed",
      value: completed,
      color: "#34d399",
      bg: "rgba(52,211,153,0.1)",
      Icon: CheckCircle2,
    },
    {
      label: "Pending",
      value: pending,
      color: "#60a5fa",
      bg: "rgba(96,165,250,0.1)",
      Icon: Clock,
    },
    {
      label: "Overdue",
      value: overdue,
      color: "#f87171",
      bg: "rgba(248,113,113,0.1)",
      Icon: AlertTriangle,
    },
    {
      label: "Total",
      value: total,
      color: "#a78bfa",
      bg: "rgba(167,139,250,0.1)",
      Icon: Target,
    },
  ];

  const cardStyle = {
    background: "linear-gradient(145deg,#0d1424,#080d18)",
    border: "1px solid rgba(255,255,255,0.06)",
  };

  return (
    <div className="flex min-h-screen bg-[#080C14]">
      <EmployeeSidebar />

      {/* pt-16 on mobile accounts for the fixed top bar */}
      <div className="md:ml-64 flex-1 px-4 md:px-10 pt-16 md:pt-8 pb-8 flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-semibold text-white/90">My Progress</h1>
          <p className="text-sm text-white/35 mt-1">
            Your personal performance summary
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="rounded-2xl h-32 animate-pulse"
                style={{ background: "rgba(255,255,255,0.03)" }}
              />
            ))}
          </div>
        ) : (
          <>
            {/* Hero */}
            <div
              className="rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-8"
              style={cardStyle}
            >
              <div className="w-36 h-36 shrink-0">
                <CircularProgressbar
                  value={pct}
                  text={`${pct}%`}
                  styles={buildStyles({
                    pathColor: level.color,
                    textColor: "#f1f5f9",
                    textSize: "18px",
                    trailColor: "rgba(255,255,255,0.05)",
                    strokeLinecap: "round",
                    pathTransitionDuration: 1.5,
                  })}
                />
              </div>
              <div className="flex flex-col gap-3 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Award size={16} style={{ color: level.color }} />
                  <span className="text-xs text-white/40 uppercase tracking-wider">
                    Current Level
                  </span>
                </div>
                <p
                  className="text-3xl font-bold"
                  style={{ color: level.color }}
                >
                  {level.label}
                </p>
                <p className="text-sm text-white/40 max-w-xs">
                  {pct === 0
                    ? "Start completing tasks to build your progress."
                    : pct < 50
                      ? "Keep going — you're making steady progress."
                      : pct < 80
                        ? "Strong performance! Push to finish remaining tasks."
                        : "Outstanding work! Almost at 100% completion."}
                </p>
                <div className="flex flex-col gap-1.5 w-full max-w-xs">
                  <div className="flex justify-between text-[11px] text-white/30">
                    <span>Overall completion</span>
                    <span>{pct}%</span>
                  </div>
                  <div
                    className="h-1.5 rounded-full w-full"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg,${level.color},${level.color}aa)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Stat grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map(({ label, value, color, bg, Icon }) => (
                <div
                  key={label}
                  className="rounded-2xl p-5 flex flex-col gap-3 items-center"
                  style={cardStyle}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: bg }}
                  >
                    <Icon size={17} style={{ color }} strokeWidth={2} />
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold" style={{ color }}>
                      {value}
                    </p>
                    <p className="text-[11px] text-white/35 mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Breakdown bars */}
            <div
              className="rounded-2xl p-6 flex flex-col gap-5"
              style={cardStyle}
            >
              <div className="flex items-center gap-2">
                <TrendingUp size={15} style={{ color: "#a78bfa" }} />
                <p className="text-xs font-medium text-white/50 uppercase tracking-widest">
                  Task Breakdown
                </p>
              </div>
              {[
                { label: "Completed", count: completed, color: "#34d399" },
                { label: "Pending", count: pending, color: "#60a5fa" },
                { label: "Overdue", count: overdue, color: "#f87171" },
              ].map(({ label, count, color }) => {
                const barPct =
                  total === 0 ? 0 : Math.round((count / total) * 100);
                return (
                  <div key={label} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span style={{ color }}>{label}</span>
                      <span className="text-white/30">
                        {count} tasks · {barPct}%
                      </span>
                    </div>
                    <div
                      className="h-2 rounded-full w-full"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${barPct}%`, background: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Motivation card */}
            <div
              className="rounded-2xl p-6 flex items-center gap-4"
              style={cardStyle}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(251,191,36,0.12)" }}
              >
                <Flame size={22} style={{ color: "#fbbf24" }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white/80">
                  Keep it up!
                </p>
                <p className="text-xs text-white/35 mt-0.5">
                  {completed === 0
                    ? "Complete your first task to start your streak."
                    : `You've completed ${completed} task${completed > 1 ? "s" : ""}. Stay consistent to reach Expert level.`}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyProgress;
