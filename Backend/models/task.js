const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    taskName: { type: String, required: true },
    taskDesc: { type: String, default: "" },
    assignTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignToUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Task", taskSchema);
