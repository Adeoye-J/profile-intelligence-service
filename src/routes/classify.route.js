import express from "express";
import { getGenderData } from "../services/genderize.service.js";
import { buildResponse } from "../utils/helpers.js";

const router = express.Router()

router.get("/classify", async (req, res) => {
    try {
        const {name} = req.query

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

        const data = await getGenderData(name)

        return res.status(200).json({
            status: "success",
            data: buildResponse(name, data)
        })

    } catch (error) {
        return res.status(error.status || 502).json({
            status: "error",
            message: error.message || "Failed to fetch data from Genderize AP"
        })
    }
})

export default router