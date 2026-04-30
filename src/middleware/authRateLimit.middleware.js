import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 9,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many authentication requests"
  }
});