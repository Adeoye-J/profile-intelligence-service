import fs from "fs"
import mongoose from "mongoose"
import dotenv from "dotenv"
import {v7 as uuidv7} from "uuid"
import Profile from "./src/models/profile.model.js"

dotenv.config()

await mongoose.connect(process.env.MONGO_URI)

const raw = JSON.parse(fs.readFileSync("seed_profiles.json"))

const data = raw.profiles

for (const p of data) {
    const normalizedName = p.name.toLowerCase();
    await Profile.updateOne(
        { name: normalizedName },
        {
            id: uuidv7(),
            name: normalizedName,

            gender: p.gender,
            gender_probability: p.gender_probability,

            age: p.age,
            age_group: p.age_group,

            country_id: p.country_id,
            country_name: p.country_name,
            country_probability: p.country_probability,

            created_at: new Date().toISOString()
        },
        { upsert: true },
    )
}

console.log("Sending complete")
process.exit();