import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


import { connectDB } from "./src/config/bd.js";
import classifyRoute from "./src/routes/classify.route.js"
import profileRoute from "./src/routes/profile.route.js"
import authRoute from "./src/routes/auth.route.js"
import { requestLogger } from "./src/middleware/logger.middleware.js";
import { apiLimiter } from "./src/middleware/rateLimit.middleware.js";


dotenv.config();

const app = express();

connectDB()

// Middlewares
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "*",
        credentials: true
    })
)
app.use(express.json())
app.use(cookieParser())
app.use(requestLogger)
app.use(apiLimiter)

// Routes
app.use("/api", classifyRoute)
app.use("/api/v1", profileRoute)
app.use("/api/v1/auth", authRoute)

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