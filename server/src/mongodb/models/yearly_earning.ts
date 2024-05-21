// models/yearly_earning.js

import mongoose from "mongoose";

// Define the MonthlyEarning schema
const MonthlyEarningSchema = new mongoose.Schema({
    month: { type: String, required: true },
    monthlyIncome: { type: Number, required: true },
});

// Define the YearlyEarning schema
const YearlyEarningSchema = new mongoose.Schema({
    year: { type: String, required: true },
    monthlyEarnings: [MonthlyEarningSchema],
    totalRevenue: { type: Number, required: true },
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

// Create the YearlyEarning model based on the YearlyEarningSchema
const YearlyEarning = mongoose.model("YearlyEarning", YearlyEarningSchema);

export default YearlyEarning;
