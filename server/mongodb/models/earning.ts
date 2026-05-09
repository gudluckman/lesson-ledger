import mongoose, { Document, Types } from "mongoose";

export interface IEarning extends Document {
    startDateOfWeek: string;
    endDateOfWeek: string;
    weeklyHours: number;
    weeklyIncome: number;
    tutor?: Types.ObjectId;
}

const EarningSchema = new mongoose.Schema({
    startDateOfWeek: { type: String, required: true },
    endDateOfWeek: { type: String, required: true },
    weeklyHours: { type: Number, required: true },
    weeklyIncome: { type: Number, required: true },
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const earningModel = mongoose.model<IEarning>("Earning", EarningSchema);

export default earningModel;
