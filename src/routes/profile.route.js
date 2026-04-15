import express from "express";
import { createProfile } from "../services/profile.service.js";

const router = express.Router()

router.post("/profile", async (req, res) => {
    try {
        const {name} = req.body

        // Validation Checks

        // Check existence first (without .trim)
        // 400: Checks if name is Missing
        if (name === undefined || name === null || !name) {
            return res.status(400).json({
                status: "error",
                message: "Name is required"
            });
        }

        // Type check BEFORE using string methods
        // 422: Not a String
        if (typeof name !== "string") {
            return res.status(422).json({
                status: "error",
                message: "Name must be a string"
            });
        }

        // Now safe to use trim
        // 400: Checks if name is Empty
        if (name.trim() === "") {
            return res.status(400).json({
                status: "error",
                message: "Name is required"
            });
        }

        const result = await createProfile(name)

        if (result.existing) {
            return res.status(200).json({
                status: "success",
                message: "Profile already exists",
                data: result.data
            })
        }

        return res.status(201).json({
            status: "success",
            data: result.data
        })

    } catch (error) {
        return res.status(error.status || 500).json({
            status: "error",
            message: error.message
        })
    }
})

export default router