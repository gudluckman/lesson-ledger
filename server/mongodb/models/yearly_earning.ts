// models/yearly_earning.js

import mongoose, { Document, Types } from "mongoose";

export interface IMonthlyEarning {
    month: string;
    monthlyIncome: number;
}

export interface IYearlyEarning extends Document {
    year: string;
    monthlyEarnings: Types.DocumentArray<IMonthlyEarning>;
    totalRevenue: number;
    tutor?: Types.ObjectId;
}

// Define the MonthlyEarning schema
const MonthlyEarningSchema = new mongoose.Schema({
    month: { type: String, required: true },
    monthlyIncome: { type: Number, required: true },
});

// Define the YearlyEarning schema
const YearlyEarningSchema = new mongoose.Schema<IYearlyEarning>({
    year: { type: String, required: true },
    monthlyEarnings: [MonthlyEarningSchema],
    totalRevenue: { type: Number, required: true },
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

YearlyEarningSchema.index({ tutor: 1, year: 1 });

// Create the YearlyEarning model based on the YearlyEarningSchema
const YearlyEarning = mongoose.model<IYearlyEarning>("YearlyEarning", YearlyEarningSchema);

export default YearlyEarning;
