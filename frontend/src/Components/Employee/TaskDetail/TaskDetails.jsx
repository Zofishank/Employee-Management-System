import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  User,
  Info,
  Clock,
  CheckCircle2,
  AlertTriangle,  
} from "lucide-react";
import EmployeeSidebar from "../SidebarMenu/EmployeeSidebar";

/* ─── Status config ─── */
const STATUS_CONFIG = {
  completed: {
    label: "Completed",
    color: "#34d399",
    bg: "rgba(52,211,153,0.10)",
    border: "rgba(52,211,153,0.18)",
    Icon: CheckCircle2,
  },
  pending: {
    label: "Pending",
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.10)",
    border: "rgba(96,165,250,0.18)",
    Icon: Clock,
  },
  expired: {
    label: "Overdue",
    color: "#f87171",
    bg: "rgba(248,113,113,0.10)",
    border: "rgba(248,113,113,0.18)",
    Icon: AlertTriangle,
  },
};

/* ─── DetailRow defined OUTSIDE component — prevents remount & icon errors ─── */
const DetailRow = ({ icon: Icon, label, value, valueColor, isLast }) => (
  <div
    className="flex items-start gap-3 py-4"
    style={isLast ? {} : { borderBottom: "1px solid rgba(255,255,255,0.04)" }}
  >
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
      style={{ background: "rgba(255,255,255,0.04)" }}
    >
      {/* Icon is always a valid lucide component passed as prop */}
      <Icon size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
    </div>
    <div className="flex flex-col gap-0.5 min-w-0">
      <p className="text-[11px] text-white/30 uppercase tracking-wider">
        {label}
      </p>
      <p
        className="text-sm leading-relaxed break-words"
        style={{ color: valueColor || "rgba(255,255,255,0.75)" }}
      >
        {value || "—"}
      </p>
    </div>
  </div>
);

/* ─── Loading skeleton ─── */
const Skeleton = ({ userData }) => (
  <div className="flex min-h-screen bg-[#080C14]">
    <EmployeeSidebar userData={userData} />
    <div className="ml-16 md:ml-64 flex-1 px-6 md:px-10 py-8 flex flex-col gap-5">
      {[
        { w: "w-24", h: 16 },
        { w: "w-64", h: 28 },
        { w: "w-full", h: 220 },
        { w: "w-full", h: 120 },
      ].map((s, i) => (
        <div
          key={i}
          className={`${s.w} rounded-2xl animate-pulse`}
          style={{ height: s.h, background: "rgba(255,255,255,0.04)" }}
        />
      ))}
    </div>
  </div>
);

/* ─── Main component ─── */
const TaskDetails = ({ userData }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to load task (${res.status}): ${text}`);
        }

        const data = await res.json();
        setTask(data);
      } catch (err) {
        console.error("TaskDetails fetch error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTask();
  }, [id, navigate]);

  if (loading) return <Skeleton userData={userData} />;

  /* ─── Error / not found state ─── */
  if (error || !task) {
    return (
      <div className="flex min-h-screen bg-[#080C14]">
        <EmployeeSidebar userData={userData} />
        <div className="ml-16 md:ml-64 flex-1 flex flex-col items-center justify-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(248,113,113,0.1)" }}
          >
            <AlertTriangle size={24} style={{ color: "#f87171" }} />
          </div>
          <p className="text-white/50 text-sm">{error || "Task not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-blue-400 hover:text-blue-300 transition flex items-center gap-1.5"
          >
            <ArrowLeft size={12} />
            Go back
          </button>
        </div>
      </div>
    );
  }

  /* ─── Determine status ─── */
  const getStatus = () => {
    if (task.status?.toLowerCase() === "completed") return "completed";
    if (task.dueDate && new Date(task.dueDate) < Date.now()) return "expired";
    return "pending";
  };

  const status = getStatus();
  const cfg = STATUS_CONFIG[status];
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;

  const dueDateStr = dueDate
    ? dueDate.toLocaleDateString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "No due date set";

  return (
    <div className="flex min-h-screen bg-[#080C14]">
      <EmployeeSidebar userData={userData} />

      <div className="ml-16 md:ml-64 flex-1 px-6 md:px-10 py-8 flex flex-col gap-6 max-w-3xl">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs text-white/35 hover:text-white/70 transition w-fit"
        >
          <ArrowLeft size={14} />
          Back to tasks
        </button>

        {/* Title + status badge */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 justify-between">
          <h1 className="text-xl font-semibold text-white/90 capitalize leading-snug flex-1">
            {task.taskName}
          </h1>
          <span
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold w-fit shrink-0 h-fit"
            style={{
              color: cfg.color,
              background: cfg.bg,
              border: `1px solid ${cfg.border}`,
            }}
          >
            <cfg.Icon size={12} strokeWidth={2.5} />
            {cfg.label}
          </span>
        </div>

        {/* Details card */}
        <div
          className="rounded-2xl px-6 flex flex-col"
          style={{
            background: "linear-gradient(145deg,#0d1424,#080d18)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Top accent line */}
          <div
            className="h-px w-full rounded-full mb-1"
            style={{
              background: `linear-gradient(90deg,transparent,${cfg.color}55,transparent)`,
            }}
          />

          <DetailRow
            icon={Info}
            label="Description"
            value={task.taskDesc || "No description provided."}
          />

          <DetailRow
            icon={Calendar}
            label="Due Date"
            value={dueDateStr}
            valueColor={status === "expired" ? "#f87171" : undefined}
          />

          <DetailRow
            icon={cfg.Icon}
            label="Status"
            value={cfg.label}
            valueColor={cfg.color}
            isLast
          />
        </div>


      </div>
    </div>
  );
};

export default TaskDetails;
