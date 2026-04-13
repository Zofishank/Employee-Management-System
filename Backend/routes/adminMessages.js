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
    res.status(500).json({ message: err.message });
  }
});

/* POST /api/messages — employee sends message to admin */
router.post("/", auth, async (req, res) => {
  try {
    const { text, receiver } = req.body;
    if (!text?.trim() || !receiver)
      return res
        .status(400)
        .json({ message: "Text and receiver are required" });

    const message = await Message.create({
      text: text.trim(),
      sender: req.user._id,
      senderRole: "employee",
      receiver,
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

/* PATCH /api/messages/:id/seen */
router.patch("/:id/seen", auth, async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message not found" });
    msg.status = "seen";
    await msg.save();
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
