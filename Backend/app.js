require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/admin/messages", require("./routes/adminMessages"));
app.use("/api/performance", require("./routes/performance"));

app.get("/", (_req, res) => res.json({ status: "ok", message: "WorkHub API running" }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("‚úÖ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () => console.log(`Ì∫Ä Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("‚ùå MongoDB connection failed:", err.message);
    process.exit(1);
  });
