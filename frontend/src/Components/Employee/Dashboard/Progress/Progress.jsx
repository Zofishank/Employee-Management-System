import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { CheckCircle2, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Progress = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const res = await fetch("http://localhost:5000/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch {
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [navigate]);

  const total = tasks.length;
  const now = new Date();

  const completed = tasks.filter(
    (t) => t.status?.toLowerCase() === "completed",
  ).length;

  const pending = tasks.filter(
    (t) => t.status?.toLowerCase() === "pending" && new Date(t.dueDate) >= now,
  ).length;

  const overdue = tasks.filter(
    (t) => t.status?.toLowerCase() !== "completed" && new Date(t.dueDate) < now,
  ).length;

  const pct = (n) => (total === 0 ? 0 : Math.round((n / total) * 100));

  const cards = [
    {
      icon: CheckCircle2,
      label: "Completed",
      value: pct(completed),
      count: completed,
      accentColor: "#34d399",
      glowColor: "rgba(52,211,153,0.12)",
      borderColor: "rgba(52,211,153,0.15)",
      trackColor: "rgba(52,211,153,0.08)",
    },
    {
      icon: Clock,
      label: "Pending",
      value: pct(pending),
      count: pending,
      accentColor: "#60a5fa",
      glowColor: "rgba(96,165,250,0.12)",
      borderColor: "rgba(96,165,250,0.15)",
      trackColor: "rgba(96,165,250,0.08)",
    },
    {
      icon: AlertTriangle,
      label: "Overdue",
      value: pct(overdue),
      count: overdue,
      accentColor: "#f87171",
      glowColor: "rgba(248,113,113,0.12)",
      borderColor: "rgba(248,113,113,0.15)",
      trackColor: "rgba(248,113,113,0.08)",
    },
    {
      icon: TrendingUp,
      label: "Overall",
      value: pct(completed),
      count: completed,
      accentColor: "#fbbf24",
      glowColor: "rgba(251,191,36,0.12)",
      borderColor: "rgba(251,191,36,0.15)",
      trackColor: "rgba(251,191,36,0.08)",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl h-44 animate-pulse"
            style={{ background: "rgba(255,255,255,0.03)" }}
          />
        ))}
      </div>
    );
  }

  if (total === 0) {
    return (
      <div
        className="w-full rounded-2xl py-12 text-center text-white/30 text-sm border border-white/[0.05]"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        No tasks available to analyze.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-white/80 tracking-wide">
          Performance Overview
        </h2>
        <span className="text-xs text-white/30">{total} total tasks</span>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <StatCard key={i} {...card} total={total} />
        ))}
      </div>
    </div>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  count,
  total,
  accentColor,
  glowColor,
  borderColor,
  trackColor,
}) => {
  if (!Icon) return null;

  return (
    <div
      className="relative rounded-2xl p-5 flex flex-col items-center gap-4 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl cursor-default"
      style={{
        background: "linear-gradient(145deg, #0d1424 0%, #080d18 100%)",
        border: `1px solid ${borderColor}`,
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${glowColor}, transparent 70%)`,
        }}
      />

      {/* Icon */}
      <div
        className="relative z-10 flex items-center justify-center w-9 h-9 rounded-xl"
        style={{ background: trackColor }}
      >
        <Icon size={17} style={{ color: accentColor }} strokeWidth={2} />
      </div>

      {/* Circular progress */}
      <div className="relative z-10 w-20 h-20">
        <CircularProgressbar
          value={value}
          text={`${value}%`}
          styles={buildStyles({
            pathColor: accentColor,
            textColor: "#f1f5f9",
            textSize: "22px",
            trailColor: trackColor,
            strokeLinecap: "round",
            pathTransitionDuration: 1.4,
          })}
        />
      </div>

      {/* Label + count */}
      <div className="relative z-10 text-center">
        <p className="text-[13px] font-medium text-white/70">{label}</p>
        <p className="text-[11px] text-white/30 mt-0.5">
          {count} / {total}
        </p>
      </div>
    </div>
  );
};

export default Progress;
