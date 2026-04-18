import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const Welcome = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [insight, setInsight] = useState("");
  const [time, setTime] = useState(new Date());

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchData = async () => {
      try {
        const [userRes, taskRes] = await Promise.all([
          fetch(import.meta.env.VITE_API_URL + "/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(import.meta.env.VITE_API_URL + "/api/tasks", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }

        if (taskRes.ok) {
          const taskData = await taskRes.json();
          setTasks(Array.isArray(taskData) ? taskData : []);
        }
      } catch (err) {
        console.error("Welcome fetch error:", err.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const total = tasks.length;
    const completed = tasks.filter(
      (t) => t.status?.toLowerCase() === "completed",
    ).length;

    if (total === 0) {
      setInsight("No tasks assigned yet — you're all clear.");
      return;
    }

    const pct = Math.floor((completed / total) * 100);
    const messages = [
      "No progress yet — start with your first task.",
      "Initial progress detected. Keep going.",
      "Momentum is building. Stay consistent.",
      "Steady progress. You're on track.",
      "Good consistency — keep pushing.",
      "Halfway there. Strong effort.",
      "Productivity is climbing. Well done.",
      "Strong performance level reached.",
      "Almost there — final stretch.",
      "Near completion. Excellent work.",
      "All tasks completed. Outstanding!",
    ];
    setInsight(messages[Math.floor(pct / 10)]);
  }, [tasks]);

  const hour = time.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const timeStr = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateStr = time.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const total = tasks.length;
  const completed = tasks.filter(
    (t) => t.status?.toLowerCase() === "completed",
  ).length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-white/[0.06]"
      style={{
        background:
          "linear-gradient(135deg, #0d1424 0%, #0a1020 50%, #080d18 100%)",
        boxShadow:
          "0 0 0 1px rgba(99,179,237,0.04), 0 24px 64px rgba(0,0,0,0.5)",
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(99,179,237,0.4), rgba(139,92,246,0.3), transparent)",
        }}
      />

      {/* Glow blobs */}
      <div
        className="absolute -top-12 -left-12 w-56 h-56 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-8 right-10 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 px-6 md:px-8 py-6">
        {/* Left — greeting */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-blue-400 opacity-70" />
            <span className="text-xs font-medium tracking-[0.15em] uppercase text-blue-400/70">
              {greeting}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
            {user?.username ? (
              <>
                {greeting.split(" ")[1]},{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage: "linear-gradient(90deg, #60a5fa, #a78bfa)",
                  }}
                >
                  {user.username}
                </span>
              </>
            ) : (
              "Welcome back"
            )}
          </h1>

          <p className="text-sm text-white/45 max-w-md leading-relaxed">
            {insight || "Loading your performance report..."}
          </p>
        </div>

        {/* Right — time + mini progress */}
        <div className="flex flex-col items-end gap-3 shrink-0">
          <div className="text-right">
            <p className="text-2xl font-semibold text-white/90 tabular-nums tracking-tight">
              {timeStr}
            </p>
            <p className="text-xs text-white/35 mt-0.5">{dateStr}</p>
          </div>

          {total > 0 && (
            <div className="flex flex-col items-end gap-1.5 w-44">
              <div className="flex justify-between w-full">
                <span className="text-[11px] text-white/40">
                  Overall progress
                </span>
                <span className="text-[11px] font-semibold text-blue-400">
                  {pct}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${pct}%`,
                    background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                  }}
                />
              </div>
              <p className="text-[11px] text-white/30">
                {completed} of {total} tasks done
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
