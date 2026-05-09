import mongoose, { Document, Types } from 'mongoose';

export interface IStudent extends Document {
  studentName: string;
  parentName: string;
  gender: string;
  year: string;
  subject: string;
  baseRate: number;
  sessionHoursPerWeek: number;
  day?: string;
  startTime?: string;
  endTime?: string;
  delivery: string;
  status: string;
  sessionType?: string;
  sessionMode: string;
  contactNumber: string;
  source?: string;
  tutor?: Types.ObjectId;
}

const StudentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  parentName: { type: String, required: true },
  gender: { type: String, required: true },
  year: { type: String, required: true },
  subject: { type: String, required: true },
  baseRate: { type: Number, required: true },
  sessionHoursPerWeek: { type: Number, required: true },
  day: {
    type: String,
  },
  startTime: { type: String },
  endTime: { type: String },
  delivery: { type: String, required: true },
  status: { type: String, required: true },
  sessionType: { type: String },
  sessionMode: { type: String, required: true },
  contactNumber: { type: String, required: true },
  source: { type: String },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

StudentSchema.index({ tutor: 1 });
StudentSchema.index({ tutor: 1, year: 1 });
StudentSchema.index({ tutor: 1, subject: 1 });

const studentModel = mongoose.model<IStudent>('Student', StudentSchema);

export default studentModel;
