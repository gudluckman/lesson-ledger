import mongoose from 'mongoose';

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

const studentModel = mongoose.model('Student', StudentSchema);

export default studentModel;
