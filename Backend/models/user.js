const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "employee"], default: "employee" },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
