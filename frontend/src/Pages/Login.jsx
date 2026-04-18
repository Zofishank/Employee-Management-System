import React, { useState } from "react";
import { motion } from "framer-motion";
import { MdEmail } from "react-icons/md";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

/* ── Shared brand panel (identical to Signup) ── */
const BrandPanel = () => (
  <div className="hidden md:flex w-1/2 relative overflow-hidden flex-col items-center justify-center">
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(135deg,#0d1424 0%,#0a1020 50%,#080d18 100%)",
      }}
    />

    <svg
      className="absolute inset-0 w-full h-full opacity-[0.04]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path
            d="M 48 0 L 0 0 0 48"
            fill="none"
            stroke="white"
            strokeWidth="0.8"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>

    <div
      className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full pointer-events-none"
      style={{
        background:
          "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
      }}
    />
    <div
      className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full pointer-events-none"
      style={{
        background:
          "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)",
      }}
    />

    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(18)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            width: 3 + Math.random() * 3,
            height: 3 + Math.random() * 3,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: "rgba(255,255,255,0.18)",
          }}
          animate={{ y: [-20, -80], opacity: [0, 0.7, 0] }}
          transition={{
            duration: 5 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
          }}
        />
      ))}
    </div>

    <div className="relative z-10 flex flex-col items-center text-center gap-8 px-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.circle
            cx="50"
            cy="50"
            r="44"
            stroke="url(#brandGrad2)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          />
          <motion.path
            d="M25 35 L35 65 L50 42 L65 65 L75 35"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
          />
          <defs>
            <linearGradient id="brandGrad2" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        className="flex flex-col gap-3"
      >
        <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
          Work
          <span
            style={{
              backgroundImage: "linear-gradient(90deg,#60a5fa,#a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Hub
          </span>
        </h1>
        <p className="text-sm text-white/40 max-w-xs leading-relaxed">
          Your all-in-one employee management platform
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex flex-wrap justify-center gap-2"
      >
        {["Task Management", "AI Assistant", "Real-time Chat", "Analytics"].map(
          (f) => (
            <span
              key={f}
              className="text-[11px] px-3 py-1.5 rounded-lg font-medium"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {f}
            </span>
          ),
        )}
      </motion.div>
    </div>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Custom toast with blue color for success
  const showSuccessToast = (message) => {
    toast.success(message, {
      style: {
        background: "#0a1020",
        color: "#fff",
        borderRadius: "12px",
        border: "1px solid rgba(59,130,246,0.3)",
      },
      progressStyle: {
        background: "#4f75f0git add",
        height: "3px",
      },
      icon: false,
    });
  };

  // Custom toast for errors
  const showErrorToast = (message) => {
    toast.error(message, {
      style: {
        background: "#0a1020",
        color: "#fff",
        borderRadius: "12px",
        border: "1px solid rgba(239,68,68,0.3)",
      },
      progressStyle: {
        background: "#ef4444",
        height: "3px",
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showErrorToast("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const API = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store user data and token
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        showSuccessToast("Login successful!");

        // Navigate based on role
        const role = data.user.role;
        if (role === "admin") {
          setTimeout(() => navigate("/admin"), 500);
        } else if (role === "employee") {
          setTimeout(() => navigate("/employee"), 500);
        } else {
          showErrorToast("Unknown user role. Please contact support.");
          setTimeout(() => navigate("/login"), 500);
        }
      } else {
        // Show specific error message based on status code
        if (res.status === 401) {
          showErrorToast("Invalid email or password. Please try again.");
        } else if (res.status === 400) {
          showErrorToast(data.message || "Please check your credentials");
        } else {
          showErrorToast(data.message || "Login failed. Please try again.");
        }

        // Clear any existing session data on failed login
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Login error:", error);
      showErrorToast(
        "Invalid email or password. Please check your credentials.",
      );

      // Clear any existing session data on error
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const inputWrap = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "11px 14px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    transition: "border-color 0.2s",
  };

  return (
    <div
      className="min-h-screen flex text-white"
      style={{ background: "#080C14" }}
    >
      <BrandPanel />

      {/* Form side */}
      <div
        className="w-full md:w-1/2 flex items-center justify-center p-6"
        style={{ background: "linear-gradient(145deg,#080C14,#0a0f1e)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="w-full max-w-md flex flex-col gap-7"
        >
          {/* Header */}
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-white/95">Welcome back</h2>
            <p className="text-sm text-white/35">
              Sign in to your WorkHub account
            </p>
          </div>

          {/* Top accent line */}
          <div
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(99,102,241,0.4),transparent)",
            }}
          />

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                Email address
              </label>
              <div
                style={inputWrap}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
                }
              >
                <MdEmail
                  style={{
                    color: "rgba(255,255,255,0.25)",
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="flex-1 bg-transparent outline-none text-sm text-white/85 placeholder-white/20"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                Password
              </label>
              <div style={inputWrap}>
                <FaLock
                  style={{
                    color: "rgba(255,255,255,0.25)",
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="flex-1 bg-transparent outline-none text-sm text-white/85 placeholder-white/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  style={{
                    color: "rgba(255,255,255,0.3)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {showPassword ? (
                    <FaEyeSlash size={14} />
                  ) : (
                    <FaEye size={14} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all mt-1 disabled:opacity-50"
              style={{
                background: loading
                  ? "rgba(99,102,241,0.5)"
                  : "linear-gradient(135deg,#3b82f6,#6366f1)",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-white/35 text-center">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-400 hover:text-blue-300 transition"
            >
              Create account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
