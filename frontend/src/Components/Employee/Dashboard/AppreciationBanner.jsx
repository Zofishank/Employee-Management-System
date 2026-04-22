import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Sparkles } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AppreciationBanner = () => {
  const [data, setData] = useState(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (dismissed) return;
    const fetch_ = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/appreciation/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json && json.message) {
          setData(json);
          setVisible(true);
        } else {
          setVisible(false);
          setData(null);
        }
      } catch (_err) {
        /* silent */
      }
    };
    fetch_();
    const iv = setInterval(fetch_, 10000); // poll every 10s
    return () => clearInterval(iv);
  }, [token, dismissed]);

  if (!visible || !data) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.97 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{
          position: "relative",
          borderRadius: 20,
          padding: "20px 24px",
          overflow: "hidden",
          background:
            "linear-gradient(135deg,#1e1040 0%,#0d1a30 60%,#0a0d18 100%)",
          border: "1px solid rgba(168,85,247,0.3)",
          boxShadow:
            "0 0 40px rgba(99,102,241,0.12), 0 0 0 1px rgba(168,85,247,0.1)",
        }}
      >
        {/* Glow blobs */}
        <div
          style={{
            position: "absolute",
            top: -30,
            left: -30,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -20,
            right: 40,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              flexShrink: 0,
              background:
                "linear-gradient(135deg,rgba(168,85,247,0.25),rgba(99,102,241,0.2))",
              border: "1px solid rgba(168,85,247,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Star size={22} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={13} style={{ color: "#a78bfa" }} />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#a78bfa",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Recognition from {data.from}
              </span>
            </div>
            <p
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "rgba(255,255,255,0.92)",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {data.message}
            </p>
            {data.sentAt && (
              <p
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.3)",
                  marginTop: 6,
                }}
              >
                {new Date(data.sentAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
          </div>

          {/* Dismiss */}
          <button
            onClick={() => {
              setVisible(false);
              setDismissed(true);
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,0.25)",
              padding: 4,
              flexShrink: 0,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Animated shimmer bar at bottom */}
        <motion.div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: 2,
            background:
              "linear-gradient(90deg,transparent,#a855f7,#6366f1,transparent)",
          }}
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default AppreciationBanner;
