import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarDays, ChevronDown, ChevronUp, Inbox } from "lucide-react";

const RecentTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [now, setNow] = useState(Date.now());
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return navigate("/login");

    const fetchTasks = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + "/api/tasks", {
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
  }, [navigate, token]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatus = (task) => {
    const due = new Date(task.dueDate);
    if (task.status?.toLowerCase() === "completed") return "completed";
    if (now > due) return "overdue";
    return "pending";
  };

  const STATUS_CONFIG = {
    completed: {
      label: "Completed",
      color: "#34d399",
      bg: "rgba(52,211,153,0.10)",
      border: "rgba(52,211,153,0.18)",
      dot: "#34d399",
    },
    pending: {
      label: "Pending",
      color: "#60a5fa",
      bg: "rgba(96,165,250,0.10)",
      border: "rgba(96,165,250,0.18)",
      dot: "#60a5fa",
    },
    overdue: {
      label: "Overdue",
      color: "#f87171",
      bg: "rgba(248,113,113,0.10)",
      border: "rgba(248,113,113,0.18)",
      dot: "#f87171",
    },
  };

  const recentTasks = tasks
    .filter((t) => t.assignTo)
    .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));

  const tasksToShow = showAll
    ? recentTasks.slice(0, 8)
    : recentTasks.slice(0, 4);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white/80 tracking-wide">
            Recent Tasks
          </h2>
          <p className="text-xs text-white/30 mt-0.5">
            Your latest assignments at a glance
          </p>
        </div>
        {recentTasks.length > 0 && (
          <span className="text-xs text-white/25 tabular-nums">
            {recentTasks.length} task{recentTasks.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl h-32 animate-pulse"
              style={{ background: "rgba(255,255,255,0.03)" }}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && recentTasks.length === 0 && (
        <div
          className="w-full rounded-2xl py-14 flex flex-col items-center gap-3 border border-white/[0.05]"
          style={{ background: "rgba(255,255,255,0.015)" }}
        >
          <Inbox size={28} className="text-white/20" />
          <p className="text-sm text-white/30">No recent tasks found</p>
        </div>
      )}

      {/* Task Grid */}
      {!loading && tasksToShow.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasksToShow.map((task) => {
            const status = getStatus(task);
            const cfg = STATUS_CONFIG[status];
            const dueDate = new Date(task.dueDate);
            const isOverdue = status === "overdue";

            return (
              <Link
                key={task._id}
                to={`/employee/tasks/${task._id}`}
                className="group relative flex flex-col gap-3 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background:
                    "linear-gradient(145deg, #0d1424 0%, #080d18 100%)",
                  border: `1px solid ${cfg.border}`,
                  boxShadow:
                    "0 0 0 1px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.03)",
                }}
              >
                {/* Subtle top glow matching status */}
                <div
                  className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${cfg.color}44, transparent)`,
                  }}
                />

                {/* Title row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Status dot */}
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0 mt-0.5"
                      style={{
                        background: cfg.dot,
                        boxShadow: `0 0 6px ${cfg.dot}`,
                      }}
                    />
                    <h3 className="text-sm font-semibold text-white/85 leading-snug truncate group-hover:text-white transition-colors">
                      {task.taskName}
                    </h3>
                  </div>

                  {/* Status badge */}
                  <span
                    className="shrink-0 px-2.5 py-0.5 rounded-lg text-[10px] font-semibold tracking-wide uppercase"
                    style={{ color: cfg.color, background: cfg.bg }}
                  >
                    {cfg.label}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-white/35 line-clamp-2 leading-relaxed pl-3.5">
                  {task.taskDesc || "No description provided."}
                </p>

                {/* Footer */}
                <div className="flex items-center gap-1.5 pl-3.5">
                  <CalendarDays
                    size={11}
                    className={isOverdue ? "text-red-400/60" : "text-white/25"}
                  />
                  <span
                    className={`text-[11px] ${isOverdue ? "text-red-400/70" : "text-white/30"}`}
                  >
                    {isOverdue ? "Was due " : "Due "}
                    {dueDate.toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Show more / less */}
      {recentTasks.length > 4 && (
        <div className="flex justify-center pt-1">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60 transition-colors py-2 px-4 rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            {showAll ? (
              <>
                <ChevronUp size={13} /> Show less
              </>
            ) : (
              <>
                <ChevronDown size={13} /> Show {recentTasks.length - 4} more
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentTasks;
