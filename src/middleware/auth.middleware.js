import { verifyAccessToken } from "../services/token.service.js";
import User from "../models/user.model.js";

export async function authenticate(req, res, next) {
  try {
    let token;

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token && req.cookies?.access_token) {
      token = req.cookies.access_token;
    }

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized"
      });
    }

    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized"
      });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized"
    });
  }
}
