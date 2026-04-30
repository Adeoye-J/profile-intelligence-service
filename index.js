import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import userRoute from "./src/routes/user.route.js";
import { authLimiter } from "./src/middleware/authRateLimit.middleware.js";
import { connectDB } from "./src/config/bd.js";
import classifyRoute from "./src/routes/classify.route.js"
import profileRoute from "./src/routes/profile.route.js"
import authRoute from "./src/routes/auth.route.js"
import { requestLogger } from "./src/middleware/logger.middleware.js";
import { apiLimiter } from "./src/middleware/rateLimit.middleware.js";
import { authenticate } from "./src/middleware/auth.middleware.js";

dotenv.config();

const app = express();

connectDB()

app.set("trust proxy", 1);

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

// IMPORTANT: rate limit auth too
app.use("/auth", authLimiter, authRoute);
app.use("/api/v1/auth", authLimiter, authRoute);

// Profile routes
app.use("/api/v1", profileRoute);
app.use("/api/v1", apiLimiter, authenticate, profileRoute);
app.use("/api/profiles", authenticate, profileRoute);

// Compatibility user route
app.use("/api/users", userRoute);
app.use("/api/v1/users", userRoute);

app.use("/auth/github", authLimiter);
app.use("/auth", authLimiter, authRoute);

// ✅ Export for Vercel
export default app;

// ✅ Run locally only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`)
// });