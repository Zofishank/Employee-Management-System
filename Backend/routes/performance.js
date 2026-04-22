const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const User = require("../models/user");
const auth = require("../middleware/authMiddleware");

/* ── GET /api/performance — full list ── */
router.get("/", auth, async (_req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password");
    const now = new Date();
    const data = await Promise.all(
      employees.map(async (emp) => {
        const tasks = await Task.find({ assignTo: emp._id });
        const completed = tasks.filter((t) => t.status === "completed").length;
        const pending = tasks.filter(
          (t) => t.status !== "completed" && new Date(t.dueDate) >= now,
        ).length;
        const overdue = tasks.filter(
          (t) => t.status !== "completed" && new Date(t.dueDate) < now,
        ).length;
        return { user: emp, completed, pending, overdue, total: tasks.length };
      }),
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── GET /api/performance/stats — admin dashboard summary ── */
router.get("/stats", auth, async (_req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password");
    const allTasks = await Task.find();
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(
      (t) => t.status === "completed",
    ).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const recentTasks = await Task.find()
      .populate("assignToUserId", "username")
      .sort({ createdAt: -1 })
      .limit(5);

    // Top performer
    let topEmployee = null;
    let topRate = -1;
    for (const emp of employees) {
      const tasks = await Task.find({ assignTo: emp._id });
      if (tasks.length === 0) continue;
      const rate =
        tasks.filter((t) => t.status === "completed").length / tasks.length;
      if (rate > topRate) {
        topRate = rate;
        topEmployee = emp;
      }
    }

    res.json({
      totalEmployees: employees.length,
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      recentTasks,
      topEmployee,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
