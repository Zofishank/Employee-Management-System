const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const User = require("../models/user");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password");
    const now = new Date();
    const data = await Promise.all(
      employees.map(async (emp) => {
        const tasks = await Task.find({ assignTo: emp._id });
        const completed = tasks.filter(t => t.status === "completed").length;
        const pending = tasks.filter(t => t.status === "pending").length;
        const overdue = tasks.filter(t => t.status === "pending" && t.dueDate && new Date(t.dueDate) < now).length;
        return { user: emp, completed, pending, overdue, total: tasks.length };
      })
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/stats", auth, async (req, res) => {
  try {
    const now = new Date();
    const [totalEmployees, totalTasks, completedTasks, pendingTasks, overdueTasks] = await Promise.all([
      User.countDocuments({ role: "employee" }),
      Task.countDocuments(),
      Task.countDocuments({ status: "completed" }),
      Task.countDocuments({ status: "pending" }),
      Task.countDocuments({ status: "pending", dueDate: { $lt: now } }),
    ]);

    const recentTasks = await Task.find()
      .populate("assignTo", "username avatar")
      .sort({ createdAt: -1 })
      .limit(5);

    const topEmployee = await Task.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: "$assignTo", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    let topEmployeeData = null;
    if (topEmployee.length > 0) {
      topEmployeeData = await User.findById(topEmployee[0]._id).select("-password");
    }

    res.json({
      totalEmployees, totalTasks, completedTasks, pendingTasks, overdueTasks,
      completionRate: totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100),
      recentTasks, topEmployee: topEmployeeData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
