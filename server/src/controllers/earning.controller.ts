import express from "express";
import Earning from "../mongodb/models/earning";
import User from "../mongodb/models/user";
import YearlyEarning from "../mongodb/models/yearly_earning";

import mongoose from "mongoose";

interface IRequest extends express.Request {
  body: {
    startDateOfWeek: Date;
    endDateOfWeek: Date;
    weeklyHours: number;
    weeklyIncome: number;
    email: string;
  };
}

interface IMonthlyEarning {
  month: string;
  monthlyIncome: number;
}

const getAllEarnings = async (req: express.Request, res: express.Response) => {
  const { _end, _order, _start, _sort } = req.query;

  const query = {};
  const options = {
    sort: { [_sort as string]: _order as string },
    limit: parseInt(_end as string),
    skip: parseInt(_start as string),
  };

  try {
    const count = await Earning.countDocuments(query);
    const earnings = await Earning.find(query, null, options);

    res.header("x-total-count", count.toString());
    res.header("Access-Control-Expose-Headers", "x-total-count");

    res.status(200).json(earnings);
  } catch (error: any) {
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

const createEarning = async (req: IRequest, res: express.Response) => {
  try {
    const { startDateOfWeek, endDateOfWeek, weeklyHours, weeklyIncome, email } =
      req.body;

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

    const currentMonthIndex = currentMonth;

    let monthlyEarning: IMonthlyEarning | undefined = yearlyEarning.monthlyEarnings.find(
      (earning) => earning.month === months[currentMonthIndex]
    );

    if (!monthlyEarning) {
      monthlyEarning = {
        month: months[currentMonthIndex],
        monthlyIncome: weeklyIncomeNumber,
      };
      yearlyEarning.monthlyEarnings.push(monthlyEarning);
    }

    monthlyEarning.monthlyIncome += weeklyIncomeNumber;
    yearlyEarning.totalRevenue += weeklyIncomeNumber;

    await yearlyEarning.save({ session });
    await session.commitTransaction();

    res.status(200).json({ message: "Earning Report created successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEarning = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const earningToDelete = await Earning.findByIdAndDelete(id).populate("tutor");

    if (!earningToDelete) throw new Error("Earning not found");

    const session = await mongoose.startSession();
    session.startTransaction();

    await earningToDelete.remove({ session });
    await earningToDelete.tutor.allEarnings.pull(earningToDelete);

    await earningToDelete.tutor.save({ session });
    await session.commitTransaction();

    res.status(200).json({ message: "Earning deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const updateEarnings = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { startDateOfWeek, endDateOfWeek, weeklyHours, weeklyIncome } =
      req.body;

    await Earning.findByIdAndUpdate(
      { _id: id },
      { startDateOfWeek, endDateOfWeek, weeklyHours, weeklyIncome }
    );

    res.status(200).json({ message: "Earning updated successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllEarnings, createEarning, deleteEarning, updateEarnings };