import Earning from "../mongodb/earning.js";
import User from "../mongodb/models/user.js";

import mongoose from "mongoose";

const getAllEarnings = async (req, res) => {
  const { _end, _order, _start, _sort } = req.query;

  const query = {};

  try {
    const count = await Earning.countDocuments(query);

    const earnings = await Earning.find(query)
      .limit(parseInt(_end))
      .skip(parseInt(_start))
      .sort({ [_sort]: _order });

    res.header("x-total-count", count);
    res.header("Access-Control-Expose-Headers", "x-total-count");

    res.status(200).json(earnings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEarning = async (req, res) => {
  try {
    const { startDateOfWeek, endDateOfWeek, weeklyHours, weeklyIncome, email } =
      req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.findOne({ email }).session(session);
    if (!user) throw new Error("User not found");

    const newEarning = await Earning.create({
      startDateOfWeek,
      endDateOfWeek,
      weeklyHours,
      weeklyIncome,
      tutor: user._id,
    });

    user.allEarnings.push(newEarning._id);
    await user.save({ session });

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
