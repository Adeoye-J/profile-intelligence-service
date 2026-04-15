import axios from "axios";
import db from "../utils/bd.js";
import { v7 as uuidv7 } from "uuid";

export async function createProfile(name) {
    const normalized = name.trim().toLowerCase()

    await db.read()

    // Idempotentcy Check
    const existing = db.data.profiles.find(
        (p) => p.name === normalized
    );

    if (existing) {
        return {
            existing: true,
            data: existing
        }
    }

    try {
        // Calling all APIS in parallel
        const [genderRes, ageRes, nationRes] = await Promise.all([
            axios.get(`https://api.genderize.io?name=${normalized}`, { timeout: 3000 }),
            axios.get(`https://api.agify.io?name=${normalized}`, { timeout: 3000 }),
            axios.get(`https://api.nationalize.io?name=${normalized}`, { timeout: 3000 })
        ]);

        const genderData = genderRes.data
        const ageData = ageRes.data
        const nationData = nationRes.data

        // Edge Cases
        if (genderData.gender === null || genderData.count === 0 || Number(genderData.probability) < 0.6 || genderData.count < 10) {
            throw {
                status: 422,
                message: "No gender prediction available"
            }
        }

        if (ageData.age === null) {
            throw {
                status: 422,
                message: "No age prediction available"
            }
        }

        if (!nationData.country || nationData.country.length === 0) {
            throw {
                status: 422,
                message: "No country prediction available"
            }
        }

        // Extract and Process data
        const gender = genderData.gender
        const gender_probability = Number(genderData.probability)
        const sample_size = genderData.count
        
        const age = ageData.age
        
        let age_group = "adult"
        
        if (age <= 12) {
            age_group = "child"
        } else if (age <= 19) {
            age_group = "teenager"
        } else if (age <= 59) {
            age_group = "adult"
        } else {
            age_group = "senior"
        }

        // Pick highest probability country
        const topCountry = [...nationData.country].sort(
            (a, b) => b.probability - a.probability
        )[0]

        const country_id = topCountry.country_id
        const country_probability = topCountry.probability

        const newProfile = {
            id: uuidv7(),
            name: normalized,
            gender,
            gender_probability,
            sample_size,
            age,
            age_group,
            country_id,
            country_probability,
            created_at: new Date().toISOString()
        }

        db.data.profiles.push(newProfile)
        await db.write()

        return {
            existing: false,
            data: newProfile
        }

    } catch (error) {
        throw {
            status: error.status || 502,
            message: error.message || "Failed to fetch external APIs"
        }
    }
}