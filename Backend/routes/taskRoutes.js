const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const User = require("../models/user");
const auth = require("../middleware/authmiddleware");

/* GET /api/tasks — tasks for current user */
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ assignTo: req.user._id })
      .populate("assignTo", "username email avatar")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET /api/tasks/all — all tasks (admin) */
router.get("/all", auth, async (_req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignTo", "username email avatar")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET /api/tasks/expiring/soon */
router.get("/expiring/soon", auth, async (_req, res) => {
  try {
    const now = new Date();
    const soon = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const tasks = await Task.find({
      dueDate: { $gte: now, $lte: soon },
      status: "pending",
    }).populate("assignTo", "username email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET /api/tasks/:id — single task */
router.get("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignTo",
      "username email avatar",
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* POST /api/tasks — create task (admin) */
router.post("/", auth, async (req, res) => {
  try {
    const { taskName, taskDesc, assignToUserId, dueDate, priority } = req.body;
    if (!taskName || !assignToUserId)
      return res
        .status(400)
        .json({ message: "taskName and assignToUserId are required" });

    const user = await User.findById(assignToUserId);
    if (!user)
      return res.status(404).json({ message: "Assigned user not found" });

    const task = await Task.create({
      taskName,
      taskDesc,
      dueDate,
      priority,
      assignTo: assignToUserId,
    });
    await task.populate("assignTo", "username email avatar");
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* PUT /api/tasks/update/:id — update task status */
router.put("/update/:id", auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    ).populate("assignTo", "username email avatar");
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
