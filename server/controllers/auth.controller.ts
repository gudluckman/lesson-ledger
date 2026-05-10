import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../mongodb/models/user";
import { getJwtSecretForSigning } from "../middleware/auth";
import { getErrorMessage } from "../utils/error";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const getAudience = () =>
  process.env.GOOGLE_CLIENT_ID || process.env.REACT_APP_GOOGLE_CLIENT_ID;

const getCalendarServiceAccountEmail = () =>
  process.env.CLIENT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL;

const getUserResponse = (user: {
  _id: unknown;
  name?: string;
  email?: string;
  avatar?: string;
  calendarId?: string;
}) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  calendarId: user.calendarId,
  calendarServiceAccountEmail: getCalendarServiceAccountEmail(),
});

const loginWithGoogle = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;
    const audience = getAudience();

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    if (!audience) {
      throw new Error("GOOGLE_CLIENT_ID is required");
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience,
    });
    const payload = ticket.getPayload();

    if (!payload?.email || !payload.sub) {
      return res.status(401).json({ message: "Invalid Google credential" });
    }

    const user = await User.findOneAndUpdate(
      {
        $or: [{ googleId: payload.sub }, { email: payload.email }],
      },
      {
        $set: {
          googleId: payload.sub,
          email: payload.email,
          name: payload.name || payload.email,
          avatar: payload.picture || "",
        },
        $setOnInsert: {
          allStudents: [],
          allEarnings: [],
          yearlyEarnings: [],
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    const token = jwt.sign({ userId: user._id }, getJwtSecretForSigning(), {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      user: getUserResponse(user),
    });
  } catch (error) {
    res.status(401).json({ message: getErrorMessage(error) });
  }
};

const getMe = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const user = await User.findById(req.user._id).select(
    "_id email name avatar calendarId"
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(getUserResponse(user));
};

const updateMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { calendarId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        calendarId: typeof calendarId === "string" ? calendarId.trim() : undefined,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("_id email name avatar calendarId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(getUserResponse(user));
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

export { getMe, loginWithGoogle, updateMe };
