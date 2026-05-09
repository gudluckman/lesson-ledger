import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../mongodb/models/user";

type AppJwtPayload = {
  userId: string;
};

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required");
  }

  return process.env.JWT_SECRET;
};

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : undefined;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const payload = jwt.verify(token, getJwtSecret()) as AppJwtPayload;
    const user = await User.findById(payload.userId).select(
      "_id email name avatar calendarId"
    );

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      _id: user._id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      calendarId: user.calendarId,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid authentication token" });
  }
};

const getJwtSecretForSigning = getJwtSecret;

export { getJwtSecretForSigning, requireAuth };
