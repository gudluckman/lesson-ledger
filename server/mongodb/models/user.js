import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String, required: true },
  allStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  allEarnings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Earning' }],
  yearlyEarnings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'YearlyEarning' }],
});

const userModel = mongoose.model('User', UserSchema);

export default userModel;