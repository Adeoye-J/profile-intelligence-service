import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import classifyRoute from "./src/routes/classify.route.js"
import profileRoute from "./src/routes/profile.route.js"

dotenv.config();

const app = express();

app.use(express.json())

// CORS
app.use(
    cors({
        origin: "*"
    })
)

// Route: GET /api/classify
app.use("/api", classifyRoute)

// Route: POST /api/profile
app.use("/api", profileRoute)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});