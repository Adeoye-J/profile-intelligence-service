import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  github_id: {
    type: String,
    required: true,
    unique: true
  },

  username: {
    type: String,
    required: true
  },

  email: {
    type: String
  },

  avatar_url: {
    type: String
  },

  role: {
    type: String,
    enum: ["admin", "analyst"],
    default: "analyst"
  },

  refresh_token: {
    type: String
  },

  created_at: {
    type: String,
    default: () => new Date().toISOString()
  }
});

const User = mongoose.models.User ?? mongoose.model("User", userSchema);

export default User;