const mongoose = require("mongoose");

const msgSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderRole: { type: String, enum: ["admin", "employee"], required: true },
    status: { type: String, enum: ["sent", "seen"], default: "sent" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Message", msgSchema);
