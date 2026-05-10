import mongoose, { Document, Types } from "mongoose";

export interface ILessonPayment extends Document {
  tutor: Types.ObjectId;
  googleEventId: string;
  paid: boolean;
}

const LessonPaymentSchema = new mongoose.Schema(
  {
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    googleEventId: { type: String, required: true },
    paid: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

LessonPaymentSchema.index({ tutor: 1, googleEventId: 1 }, { unique: true });

const lessonPaymentModel = mongoose.model<ILessonPayment>(
  "LessonPayment",
  LessonPaymentSchema
);

export default lessonPaymentModel;
