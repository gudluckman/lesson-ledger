import Earning from "../mongodb/models/earning.js";
import User, { IUser } from "../mongodb/models/user.js";
import YearlyEarning from "../mongodb/models/yearly_earning.js";

import mongoose, { ClientSession, Types } from "mongoose";
import { Request, Response } from "express";
import { getErrorMessage } from "../utils/error.js";
import { IEarning } from "../mongodb/models/earning.js";
import { getQueryNumber, getQueryString } from "../utils/query.js";

type PopulatedTutorEarning = Omit<IEarning, "tutor"> & { tutor: IUser };

type ApplyEarningToYearlyTotalInput = {
  tutorId: Types.ObjectId;
  endDateOfWeek: string;
  weeklyIncome: number;
  session: ClientSession;
  direction?: 1 | -1;
};

const getUserQuery = async (req: Request) => {
  const email = getQueryString(req.query.email);
  if (!email) return {};

  const user = await User.findOne({ email }).select("_id");
  return user ? { tutor: user._id } : { tutor: null };
};

const getAllEarnings = async (req: Request, res: Response) => {
  const { _end, _order, _start, _sort } = req.query;
  const sortField = getQueryString(_sort);
  const sortOrder = getQueryString(_order);
  const limit = getQueryNumber(_end);
  const skip = getQueryNumber(_start);

  try {
    const query = await getUserQuery(req);
    const options = {
      sort: sortField ? { [sortField]: sortOrder === "desc" ? -1 : 1 } : undefined,
      limit,
      skip,
    };

    const count = await Earning.countDocuments(query);
    const earnings = await Earning.find(query, null, options);

    res.header("x-total-count", count.toString());
    res.header("Access-Control-Expose-Headers", "x-total-count");

    res.status(200).json(earnings);
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) });
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

const applyEarningToYearlyTotal = async ({
  tutorId,
  endDateOfWeek,
  weeklyIncome,
  session,
  direction = 1,
}: ApplyEarningToYearlyTotalInput) => {
  const income = Number(weeklyIncome);
  if (!Number.isFinite(income)) {
    throw new Error("Weekly income is not a valid number");
  }

  const endDate = new Date(endDateOfWeek);
  if (Number.isNaN(endDate.getTime())) {
    throw new Error("End date is not valid");
  }

  const year = endDate.getFullYear().toString();
  const month = months[endDate.getMonth()];

  let yearlyEarning = await YearlyEarning.findOne({
    year,
    tutor: tutorId,
  }).session(session);

  if (!yearlyEarning) {
    yearlyEarning = new YearlyEarning({
      year,
      monthlyEarnings: [],
      totalRevenue: 0,
      tutor: tutorId,
    });
  }

  let monthlyEarning = yearlyEarning.monthlyEarnings.find(
    (earning) => earning.month === month
  );

  if (!monthlyEarning) {
    yearlyEarning.monthlyEarnings.push({
      month,
      monthlyIncome: 0,
    });
    monthlyEarning = yearlyEarning.monthlyEarnings.find(
      (earning) => earning.month === month
    );
    if (!monthlyEarning) {
      throw new Error("Failed to create monthly earning");
    }
  }

  monthlyEarning.monthlyIncome = Math.max(
    0,
    monthlyEarning.monthlyIncome + income * direction
  );
  yearlyEarning.totalRevenue = Math.max(
    0,
    yearlyEarning.totalRevenue + income * direction
  );

  await yearlyEarning.save({ session });
};

const createEarning = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();

  try {
    const { startDateOfWeek, endDateOfWeek, weeklyHours, weeklyIncome, email } =
      req.body;

    const weeklyHoursNumber = Number(weeklyHours);
    const weeklyIncomeNumber = Number(weeklyIncome);

    if (!Number.isFinite(weeklyHoursNumber)) {
      throw new Error("Weekly hours is not a valid number");
    }

    if (!Number.isFinite(weeklyIncomeNumber)) {
      throw new Error("Weekly income is not a valid number");
    }

    session.startTransaction();

    const user = await User.findOne({ email }).session(session);
    if (!user) throw new Error("User not found");

    const [newEarning] = await Earning.create(
      [
        {
          startDateOfWeek,
          endDateOfWeek,
          weeklyHours: weeklyHoursNumber,
          weeklyIncome: weeklyIncomeNumber,
          tutor: user._id,
        },
      ],
      { session }
    );

    user.allEarnings.push(newEarning._id);
    await user.save({ session });

    await applyEarningToYearlyTotal({
      tutorId: user._id,
      endDateOfWeek,
      weeklyIncome: weeklyIncomeNumber,
      session,
    });
    await session.commitTransaction();

    res.status(200).json({ message: "Earning Report created successfully" });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    res.status(500).json({ message: getErrorMessage(error) });
  } finally {
    session.endSession();
  }
};

const deleteEarning = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;

    const earningToDelete = await Earning.findById({
      _id: id,
    }).populate<{ tutor: IUser }>("tutor") as PopulatedTutorEarning | null;
    if (!earningToDelete) throw new Error("Earning not found");

    session.startTransaction();

    await Earning.deleteOne({ _id: id }).session(session);
    earningToDelete.tutor.allEarnings.pull(earningToDelete._id);

    await earningToDelete.tutor.save({ session });

    await applyEarningToYearlyTotal({
      tutorId: earningToDelete.tutor._id,
      endDateOfWeek: earningToDelete.endDateOfWeek,
      weeklyIncome: earningToDelete.weeklyIncome,
      session,
      direction: -1,
    });

    await session.commitTransaction();

    res.status(200).json({ message: "Earning deleted successfully" });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    res.status(500).json({ message: getErrorMessage(error) });
  } finally {
    session.endSession();
  }
};

const updateEarnings = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;
    const { startDateOfWeek, endDateOfWeek, weeklyHours, weeklyIncome } =
      req.body;

    const weeklyHoursNumber = Number(weeklyHours);
    const weeklyIncomeNumber = Number(weeklyIncome);

    if (!Number.isFinite(weeklyHoursNumber)) {
      throw new Error("Weekly hours is not a valid number");
    }

    if (!Number.isFinite(weeklyIncomeNumber)) {
      throw new Error("Weekly income is not a valid number");
    }

    session.startTransaction();

    const existingEarning = await Earning.findById(id).session(session);
    if (!existingEarning) throw new Error("Earning not found");
    if (!existingEarning.tutor) throw new Error("Earning tutor not found");

    await applyEarningToYearlyTotal({
      tutorId: existingEarning.tutor,
      endDateOfWeek: existingEarning.endDateOfWeek,
      weeklyIncome: existingEarning.weeklyIncome,
      session,
      direction: -1,
    });

    existingEarning.startDateOfWeek = startDateOfWeek;
    existingEarning.endDateOfWeek = endDateOfWeek;
    existingEarning.weeklyHours = weeklyHoursNumber;
    existingEarning.weeklyIncome = weeklyIncomeNumber;
    await existingEarning.save({ session });

    await applyEarningToYearlyTotal({
      tutorId: existingEarning.tutor,
      endDateOfWeek,
      weeklyIncome: weeklyIncomeNumber,
      session,
    });

    await session.commitTransaction();

    res.status(200).json({ message: "Earning updated successfully" });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    res.status(500).json({ message: getErrorMessage(error) });
  } finally {
    session.endSession();
  }
};

const rebuildYearlyEarnings = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();

  try {
    const { email } = req.body;

    session.startTransaction();

    const user = await User.findOne({ email }).session(session);
    if (!user) throw new Error("User not found");

    await YearlyEarning.deleteMany({ tutor: user._id }).session(session);

    const earnings = await Earning.find({ tutor: user._id }).session(session);
    for (const earning of earnings) {
      await applyEarningToYearlyTotal({
        tutorId: user._id,
        endDateOfWeek: earning.endDateOfWeek,
        weeklyIncome: earning.weeklyIncome,
        session,
      });
    }

    await session.commitTransaction();

    res.status(200).json({ message: "Yearly earnings rebuilt successfully" });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    res.status(500).json({ message: getErrorMessage(error) });
  } finally {
    session.endSession();
  }
};

export {
  getAllEarnings,
  createEarning,
  deleteEarning,
  updateEarnings,
  rebuildYearlyEarnings,
};
