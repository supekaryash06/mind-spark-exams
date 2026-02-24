import jwt from "jsonwebtoken";
import { config } from "./config.js";

export const signToken = (user) =>
  jwt.sign({ userId: user.id, email: user.email, name: user.full_name }, config.jwtSecret, {
    expiresIn: "12h",
  });

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing authorization token" });
  }

  const token = header.replace("Bearer ", "");
  try {
    req.user = jwt.verify(token, config.jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
