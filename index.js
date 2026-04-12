import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// CORS
app.use(
    cors({
        origin: "*"
    })
)

// Route: GET /api/classify
app.get("/api/classify", async (req, res) => {
    try {
        const {name} = req.query;

        // 400: Missing or Empty
        if (!name || name.trim() === "") {
            return res.status(400).json({
                status: "error",
                message: "name query parameter is required"
            });
        }

        // 422: Not a String
        if (typeof name !== "string") {
            return res.status(422).json({
                status: "error",
                message: "Name must be a string"
            });
        }

        // API call - Genderize
        const response = await axios.get(`https://api.genderize.io?name=${name}`, {timeout: 3000})

        const {gender, probability, count} = response.data

        // Edge Case
        if (gender === null || count === 0) {
            return res.status(422).json({
                status: "error",
                message: "No prediction available for the provided name"
            });
        }

        // Process Data
        const sample_size = count;

        const is_confident = (Number(probability) >= 0.7) && (sample_size >= 100);

        const processed_at = new Date().toISOString();

        // 200: Success
        return res.status(200).json({
            status: "success",
            data: {
                name: name.toLowerCase(),
                gender,
                probability: Number(probability),
                sample_size,
                is_confident,
                processed_at
            }
        })

    } catch (error) {
        return res.status(502).json({
            status: "error",
            message: "Failed to fetch fata from Genderize API"
        });
    }
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});