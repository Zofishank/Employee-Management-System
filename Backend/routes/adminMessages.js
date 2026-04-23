const express = require("express");
const router = express.Router();
const Message = require("../models/msg");
const auth = require("../middleware/authMiddleware");
const User = require("../models/user");

/* GET /api/admin/messages — all messages for admin */
router.get("/", auth, async (req, res) => {
  try {
    const messages = await Message.find()
      .populate("sender", "username email avatar role")
      .populate("receiver", "username email avatar role")
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* POST /api/admin/messages/reply — admin replies to employee */
router.post("/reply", auth, async (req, res) => {
  try {
    const { text, employeeId } = req.body;
    if (!text?.trim() || !employeeId)
      return res.status(400).json({ message: "Text and employeeId are required" });

    const message = await Message.create({
      text: text.trim(),
      sender: req.user._id,
      senderRole: "admin",
      receiver: employeeId,
    });
    await message.populate([
      { path: "sender", select: "username email avatar role" },
      { path: "receiver", select: "username email avatar role" },
    ]);
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* PATCH /api/admin/messages/:id/seen */
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