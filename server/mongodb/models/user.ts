import mongoose, { Document, Types } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  avatar: string;
  allStudents: Types.Array<Types.ObjectId>;
  allEarnings: Types.Array<Types.ObjectId>;
  yearlyEarnings: Types.Array<Types.ObjectId>;
}

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String, required: true },
  allStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  allEarnings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Earning' }],
  yearlyEarnings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'YearlyEarning' }],
});

const userModel = mongoose.model<IUser>('User', UserSchema);

export default userModel;
