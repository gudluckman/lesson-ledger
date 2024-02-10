import mongoose from "mongoose";

const EarningSchema = new mongoose.Schema({
    startDateOfWeek: { type: String, required: true },
    endDateOfWeek: { type: String, required: true },
    weeklyHours: { type: Number, required: true },
    weeklyIncome: { type: Number, required: true },
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const earningModel = mongoose.model("Earning", EarningSchema);

export default earningModel;