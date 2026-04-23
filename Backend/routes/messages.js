const express = require("express");
const router = express.Router();
const Message = require("../models/msg");
const auth = require("../middleware/authMiddleware");

/* GET /api/messages — employee's own messages */
router.get("/", auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate("sender", "username email avatar role")
      .populate("receiver", "username email avatar role")
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error("Messages GET error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

/* POST /api/messages — employee sends message to admin */
router.post("/", auth, async (req, res) => {
  try {
    const { text, receiver } = req.body;
    if (!text?.trim() || !receiver)
      return res.status(400).json({ message: "Text and receiver are required" });

    const message = await Message.create({
      text: text.trim(),
      sender: req.user._id,
      senderRole: req.user.role || "employee",
      receiver,
    });
    await message.populate([
      { path: "sender", select: "username email avatar role" },
      { path: "receiver", select: "username email avatar role" },
    ]);
    res.status(201).json(message);
  } catch (err) {
    console.error("Messages POST error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

/* PATCH /api/messages/:id/seen */
router.patch("/:id/seen", auth, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { status: "seen" },
      { new: true }
    );
    if (!msg) return res.status(404).json({ message: "Message not found" });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
