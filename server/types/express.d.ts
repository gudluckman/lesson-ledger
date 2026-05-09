import { Types } from "mongoose";

declare global {
  namespace Express {
    interface AuthenticatedUser {
      _id: Types.ObjectId;
      email: string;
      name: string;
      avatar: string;
      calendarId?: string;
    }

    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
