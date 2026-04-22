const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const User = require("../models/user");
const auth = require("../middleware/authMiddleware");

/* GET /api/performance - all employees performance */
router.get("/", auth, async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password");
    const data = await Promise.all(
      employees.map(async (emp) => {
        const tasks = await Task.find({ assignToUserId: emp._id });
        const completed = tasks.filter((t) => t.status === "completed").length;
        const pending = tasks.filter((t) => t.status === "pending").length;
        return { user: emp, completed, pending, total: tasks.length };
      }),
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET /api/performance/stats - admin dashboard stats */
router.get("/stats", auth, async (req, res) => {
  try {
    const [totalEmployees, totalTasks, completedTasks, pendingTasks] =
      await Promise.all([
        User.countDocuments({ role: "employee" }),
        Task.countDocuments(),
        Task.countDocuments({ status: "completed" }),
        Task.countDocuments({ status: "pending" }),
      ]);

    const recentTasks = await Task.find()
      .populate("assignToUserId", "username avatar")
      .sort({ createdAt: -1 })
      .limit(5);

    const topEmployee = await Task.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: "$assignToUserId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    let topEmployeeData = null;
    if (topEmployee.length > 0) {
      topEmployeeData = await User.findById(topEmployee[0]._id).select(
        "-password",
      );
    }

    res.json({
      totalEmployees,
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate:
        totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100),
      recentTasks,
      topEmployee: topEmployeeData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
