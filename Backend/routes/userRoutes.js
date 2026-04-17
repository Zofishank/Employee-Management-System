const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const User = require("../models/user");
const auth = require("../middleware/authMiddleware");

/* ── Multer config ── */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = "uploads/avatars";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`,
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype))
      cb(null, true);
    else cb(new Error("Only JPG & PNG allowed"));
  },
});

/* GET /api/users — all users */
router.get("/", auth, async (_req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET /api/users/me — current user */
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* PUT /api/users/update — update profile */
router.put(
  "/update",
  auth,
  (req, res, next) => {
    upload.single("avatar")(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE")
          return res.status(400).json({ message: "Image too large. Max 5MB." });
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const { username, email, phone, password } = req.body;
      const updates = {};
      if (username) updates.username = username;
      if (email) updates.email = email;
      if (phone !== undefined) updates.phone = phone;
      if (password && password.trim()) {
        updates.password = await bcrypt.hash(password, 10);
      }
      if (req.file) {
        const user = await User.findById(req.user._id);
        if (user?.avatar) {
          const old = path.join(".", user.avatar);
          try {
            if (fs.existsSync(old)) fs.unlinkSync(old);
          } catch (_e) {
            /* ignore */
          }
        }
        updates.avatar = `/uploads/avatars/${req.file.filename}`;
      }
      const updated = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updates },
        { new: true },
      ).select("-password");
      if (!updated) return res.status(404).json({ message: "User not found" });
      res.json({ message: "Profile updated successfully", user: updated });
    } catch (err) {
      console.error("Update error:", err.message);
      res.status(500).json({ message: err.message });
    }
  },
);

module.exports = router;
