import Earning from "../mongodb/models/earning.js";
import User from "../mongodb/models/user.js";
import YearlyEarning from "../mongodb/models/yearly_earning.js";

import mongoose from "mongoose";

const getAllEarnings = async (req, res) => {
  const { _end, _order, _start, _sort } = req.query;

  const query = {};
  const options = {
    sort: { [_sort]: _order },
    limit: parseInt(_end),
    skip: parseInt(_start),
  };

  try {
    const count = await Earning.countDocuments(query);
    const earnings = await Earning.find(query, null, options);

    res.header("x-total-count", count);
    res.header("Access-Control-Expose-Headers", "x-total-count");

    res.status(200).json(earnings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const createEarning = async (req, res) => {
  try {
    const { startDateOfWeek, endDateOfWeek, weeklyHours, weeklyIncome, email } =
      req.body;

    // Convert weeklyIncome to a number type
    const weeklyIncomeNumber = Number(weeklyIncome);

    if (isNaN(weeklyIncomeNumber)) {
      throw new Error("Weekly income is not a valid number");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.findOne({ email }).session(session);
    if (!user) throw new Error("User not found");

    const newEarning = await Earning.create({
      startDateOfWeek,
      endDateOfWeek,
      weeklyHours,
      weeklyIncome: weeklyIncomeNumber,
      tutor: user._id,
    });

    user.allEarnings.push(newEarning._id);
    await user.save({ session });

    // Update Monthly and Yearly Earnings
    const endDate = new Date(endDateOfWeek);
    const currentYear = endDate.getFullYear().toString();
    const currentMonth = endDate.getMonth();

    let yearlyEarning = await YearlyEarning.findOne({
      year: currentYear,
      tutor: user._id,
    }).session(session);

    if (!yearlyEarning) {
      yearlyEarning = await YearlyEarning.create({
        year: currentYear,
        monthlyEarnings: [],
        totalRevenue: weeklyIncomeNumber,
        tutor: user._id,
      });
    }

    // Get the current month's index (0 for January, 1 for February, ...)
    const currentMonthIndex = currentMonth;

    // Find the monthly earnings for the current month
    let monthlyEarning = yearlyEarning.monthlyEarnings.find(
      (earning) => earning.month === months[currentMonthIndex]
    );

    if (!monthlyEarning) {
      // If the monthly earnings for the current month don't exist, create them based on what the current weeklyincome is
      monthlyEarning = {
        month: months[currentMonthIndex],
        monthlyIncome: weeklyIncomeNumber,
      };
      yearlyEarning.monthlyEarnings.push(monthlyEarning);
    }

    // Add the weekly income to the monthly income
    monthlyEarning.monthlyIncome += weeklyIncomeNumber;
    yearlyEarning.totalRevenue += weeklyIncomeNumber;

    await yearlyEarning.save({ session });
    await session.commitTransaction();

    res.status(200).json({ message: "Earning Report created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEarning = async (req, res) => {
  try {
    const { id } = req.params;

    const earningToDelete = await Earning.findByIdAndDelete({
      _id: id,
    }).populate("tutor");
    if (!earningToDelete) throw new Error("Earning not found");

    const session = await mongoose.startSession();
    session.startTransaction();

    earningToDelete.remove({ session });
    earningToDelete.tutor.allEarnings.pull(earningToDelete);

    await earningToDelete.tutor.save({ session });
    await session.commitTransaction();

    res.status(200).json({ message: "Earning deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEarnings = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDateOfWeek, endDateOfWeek, weeklyHours, weeklyIncome } =
      req.body;

    await Earning.findByIdAndUpdate(
      { _id: id },
      { startDateOfWeek, endDateOfWeek, weeklyHours, weeklyIncome }
    );

    res.status(200).json({ message: "Earning updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllEarnings, createEarning, deleteEarning, updateEarnings };
