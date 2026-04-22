// Backend/routes/appreciation.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

// Simple in-memory store — replace with a Mongoose model for persistence
// We use a module-level Map so it survives across requests in the same process
const appreciations = new Map(); // userId → { message, from, sentAt }

/* ── POST /api/appreciation  (admin sends appreciation) ── */
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const { userId, message } = req.body;
    if (!userId || !message?.trim())
      return res.status(400).json({ message: "userId and message required" });

    appreciations.set(String(userId), {
      message: message.trim(),
      from: req.user.username || "Admin",
      sentAt: new Date().toISOString(),
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── GET /api/appreciation/me  (employee checks their appreciation) ── */
router.get("/me", auth, async (req, res) => {
  try {
    const data = appreciations.get(String(req.user._id)) || null;
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── DELETE /api/appreciation/:userId  (admin removes appreciation) ── */
router.delete("/:userId", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });
    appreciations.delete(String(req.params.userId));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
