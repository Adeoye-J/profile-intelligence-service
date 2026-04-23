import express from "express";
import { createProfile } from "../services/profile.service.js";
import Profile from "../models/profile.model.js";
import { buildOptions, buildQuery } from "../services/query.service.js";
import { parseQuery } from "../utils/parser.js";

const router = express.Router()

router.post("/profiles", async (req, res) => {
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

router.get("/profiles", async (req, res) => {

    try {
        const query = buildQuery(req.query)
        const {sort, page, limit, skip} = buildOptions(req.query)

        const [data, total] = await Promise.all([
            Profile.find(query).sort(sort).skip(skip).limit(limit),
            Profile.countDocuments(query)
        ])
    
        // const profiles = await Profile.find(query);
    
        // res.json({
        //     status: "success",
        //     count: profiles.length,
        //     data: profiles.map(profile => ({
        //         id: profile.id,
        //         name: profile.name,
        //         gender: profile.gender,
        //         age: profile.age,
        //         age_group: profile.age_group,
        //         country_id: profile.country_id
        //     }))
        // })

        res.json({ status: "success", page, limit, total, data })
        
    } catch (error) {
        res.status(error.status || 500).json({ 
            status: "error", 
            message: error.message || "Server error" 
        })
    }

})

router.get("/profiles/search", async (req, res) => {
    const { q } = req.query

    if (!q || typeof q !== "string") {
        return res.status(400).json({
            status: "error",
            message: "Invalid query parameters"
        })
    }
    const parsed = parseQuery(q)

    if (!parsed) {
        return res.status(400).json({
            status: "error",
            message: "Unable to interpret query"
        })
    }

    const mongoQuery = buildQuery(parsed)
    const {sort, page, limit, skip} = buildOptions(req.query)

    const [data, total] = await Promise.all([
        Profile.find(mongoQuery).sort(sort).skip(skip).limit(limit),
        Profile.countDocuments(mongoQuery)
    ])

    res.json({
        status: "success",
        page,
        limit,
        total,
        data
    })
})

router.get("/profiles/:id", async (req, res) => {
    const profile = await Profile.findOne({ id: req.params.id })

    if (!profile) {
        return res.status(404).json({
            status: "error",
            message: "Profile not found"
        })
    }

    res.status(200).json({
        status: "success",
        data: profile
    })
})

router.delete("/profiles/:id", async (req, res) => {
    const result = await Profile.findOneAndDelete({ id: req.params.id })

    if (!result) {
        return res.status(404).json({
            status: "error",
            message: "Profile not found"
        })
    }

    res.status(204).send()
})

export default router