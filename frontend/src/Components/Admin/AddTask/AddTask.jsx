import React, { useState, useEffect, useRef } from "react";
import lottie from "lottie-web";
import Lottie from "lottie-react";
import { defineElement } from "lord-icon-element";
import TaskIcon from "../../../assets/taskIcon.json";
import AssignIcon from "../../../assets/AssignIcon.json";
import AdminSidebar from "../SidebarMenu/AdminSidebar"
import { CheckCircle2, AlertCircle } from "lucide-react";

const AddTask = () => {
  const [employees, setEmployees] = useState([]);
  const [taskData, setTaskData] = useState({
    taskName: "",
    taskDesc: "",
    assignToUserId: "",
    dueDate: "",
  });
  const [status, setStatus] = useState(null); // "success" | "error" | null
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const assignLottieRef = useRef();

  useEffect(() => {
    defineElement(lottie.loadAnimation);
    const token = localStorage.getItem("token");
    const API = import.meta.env.VITE_API_URL;
    fetch(`${API}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setEmployees)
      .catch(console.error);
  }, []);

  const cap = (v) => (v ? v.charAt(0).toUpperCase() + v.slice(1) : v);
  const handleChange = (field, value) =>
    setTaskData({ ...taskData, [field]: value });

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(import.meta.env.VITE_API_URL + "/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setStatusMsg("Task assigned successfully!");
        setTaskData({
          taskName: "",
          taskDesc: "",
          assignToUserId: "",
          dueDate: "",
        });
      } else {
        setStatus("error");
        setStatusMsg(data.message || "Failed to add task");
      }
    } catch {
      setStatus("error");
      setStatusMsg("Network error — please try again");
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 4000);
    }
  };

  const inputClass =
    "w-full bg-transparent text-sm text-white/80 placeholder-white/20 outline-none";
  const rowStyle = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
  };

  return (
    <div className="flex min-h-screen bg-[#080C14]">
      <AdminSidebar />
      <div className="md:ml-64 flex-1 px-4 md:px-10 pt-16 md:pt-8 pb-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Lottie
            animationData={TaskIcon}
            loop
            autoplay
            style={{ width: 36, height: 36 }}
          />
          <div>
            <h1 className="text-xl font-semibold text-white/90">
              Add New Task
            </h1>
            <p className="text-sm text-white/35 mt-0.5">
              Assign work to your team members
            </p>
          </div>
        </div>

        {/* Status banner */}
        {status && (
          <div
            className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium"
            style={{
              background:
                status === "success"
                  ? "rgba(52,211,153,0.1)"
                  : "rgba(248,113,113,0.1)",
              border:
                status === "success"
                  ? "1px solid rgba(52,211,153,0.2)"
                  : "1px solid rgba(248,113,113,0.2)",
              color: status === "success" ? "#34d399" : "#f87171",
            }}
          >
            {status === "success" ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            {statusMsg}
          </div>
        )}

        {/* Form card */}
        <div
          className="rounded-2xl p-6 md:p-8 max-w-2xl"
          style={{
            background: "linear-gradient(145deg,#0d1424,#080d18)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <form onSubmit={submitHandler} className="flex flex-col gap-5">
            {/* Task Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/45">Task Name</label>
              <div
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl"
                style={rowStyle}
              >
                <input
                  type="text"
                  value={taskData.taskName}
                  required
                  onChange={(e) =>
                    handleChange("taskName", cap(e.target.value))
                  }
                  placeholder="e.g. Design landing page UI"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Assign To */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/45">Assign To</label>
              <div
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl"
                style={rowStyle}
              >
                <select
                  value={taskData.assignToUserId}
                  required
                  onChange={(e) =>
                    handleChange("assignToUserId", e.target.value)
                  }
                  className="w-full bg-transparent text-sm text-white/80 outline-none"
                  style={{
                    color: taskData.assignToUserId
                      ? "rgba(255,255,255,0.8)"
                      : "rgba(255,255,255,0.25)",
                  }}
                >
                  <option value="" style={{ background: "#0d1424" }}>
                    Select employee
                  </option>
                  {employees
                    .filter((e) => e.role !== "admin")
                    .map((emp) => (
                      <option
                        key={emp._id}
                        value={emp._id}
                        style={{ background: "#0d1424" }}
                      >
                        {emp.username}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/45">Task Description</label>
              <div className="px-3.5 py-2.5 rounded-xl" style={rowStyle}>
                <textarea
                  value={taskData.taskDesc}
                  rows={4}
                  onChange={(e) =>
                    handleChange("taskDesc", cap(e.target.value))
                  }
                  placeholder="Describe the task clearly and professionally..."
                  className="w-full bg-transparent text-sm text-white/80 placeholder-white/20 outline-none resize-none"
                />
              </div>
            </div>

            {/* Due Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/45">Due Date</label>
              <div
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl"
                style={rowStyle}
              >
                <input
                  type="date"
                  value={taskData.dueDate}
                  required
                  onChange={(e) => handleChange("dueDate", e.target.value)}
                  className="w-full bg-transparent text-sm text-white/80 outline-none"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              onMouseEnter={() => assignLottieRef.current?.play()}
              onMouseLeave={() => assignLottieRef.current?.stop()}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition disabled:opacity-40 mt-2"
              style={{
                background: loading
                  ? "rgba(14,165,233,0.4)"
                  : "linear-gradient(135deg,#0ea5e9,#6366f1)",
              }}
            >
              {loading ? "Assigning..." : "Assign Task"}
              <Lottie
                lottieRef={assignLottieRef}
                animationData={AssignIcon}
                loop
                autoplay={false}
                style={{ width: 20, height: 20 }}
              />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
