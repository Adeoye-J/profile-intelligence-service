import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    }, //uuidv7
    name: {
        type: String,
        required: true,
        unique: true
    },
    gender: String,
    gender_probability: Number,
    sample_size: Number,

    age: Number,
    age_group: String,

    country_id: String,
    country_name: String,
    country_probability: Number,

    created_at: String
})

profileSchema.index({ gender: 1 })
profileSchema.index({ age: 1 })
profileSchema.index({ country_id: 1 })

const Profile = mongoose.models.Profile ?? mongoose.model("Profile", profileSchema)

export default Profile