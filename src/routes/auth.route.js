import express from "express";
import crypto from "crypto";
import User from "../models/user.model.js";
import {
  exchangeCodeForGithubToken,
  getGithubUser
} from "../services/github.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from "../services/token.service.js";

const router = express.Router();

const pkceStore = new Map();

function base64URLEncode(buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest();
}

router.get("/github", (req, res) => {
  const codeVerifier = base64URLEncode(crypto.randomBytes(32));
  const codeChallenge = base64URLEncode(sha256(codeVerifier));
  const state = base64URLEncode(crypto.randomBytes(16));

  pkceStore.set(state, codeVerifier);

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: process.env.GITHUB_CALLBACK_URL,
    scope: "read:user user:email",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256"
  });

  return res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

router.get("/github/callback", async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code || !state || !pkceStore.has(state)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid OAuth callback"
      });
    }

    pkceStore.delete(state);

    const githubToken = await exchangeCodeForGithubToken(code);
    const githubUser = await getGithubUser(githubToken);

    let user = await User.findOne({ github_id: String(githubUser.id) });

    if (!user) {
      user = await User.create({
        github_id: String(githubUser.id),
        username: githubUser.login,
        email: githubUser.email,
        avatar_url: githubUser.avatar_url,
        role: "analyst"
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refresh_token = refreshToken;
    await user.save();

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      status: "success",
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          username: user.username,
          role: user.role
        }
      }
    });
  } catch {
    return res.status(500).json({
      status: "error",
      message: "Authentication failed"
    });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const token = req.body.refresh_token || req.cookies?.refresh_token;

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Refresh token required"
      });
    }

    const decoded = verifyRefreshToken(token);

    const user = await User.findById(decoded.id);

    if (!user || user.refresh_token !== token) {
      return res.status(401).json({
        status: "error",
        message: "Invalid refresh token"
      });
    }

    const accessToken = generateAccessToken(user);

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000
    });

    return res.json({
      status: "success",
      data: {
        access_token: accessToken
      }
    });
  } catch {
    return res.status(401).json({
      status: "error",
      message: "Invalid refresh token"
    });
  }
});

router.post("/logout", async (req, res) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  return res.json({
    status: "success",
    message: "Logged out successfully"
  });
});

export default router;