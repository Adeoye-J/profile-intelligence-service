import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/bd.js";

import classifyRoute from "./src/routes/classify.route.js"
import profileRoute from "./src/routes/profile.route.js"

dotenv.config();

const app = express();

connectDB()

// Middlewares
app.use(
    cors({
        origin: "*"
    })
)
app.use(express.json())

// Routes
app.use("/api", classifyRoute)
app.use("/api", profileRoute)

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