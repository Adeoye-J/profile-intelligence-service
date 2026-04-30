import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", authenticate, (req, res) => {
  return res.status(200).json({
    status: "success",
    data: {
      id: req.user._id,
      username: req.user.username,
      role: req.user.role,
      avatar_url: req.user.avatar_url
    }
  });
});

export default router;