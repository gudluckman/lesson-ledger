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

EarningSchema.index({ tutor: 1, startDateOfWeek: 1 });
EarningSchema.index({ tutor: 1, endDateOfWeek: 1 });

const earningModel = mongoose.model<IEarning>("Earning", EarningSchema);

export default earningModel;
