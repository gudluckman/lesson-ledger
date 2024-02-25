import Student from "../mongodb/models/student.js";
import User from "../mongodb/models/user.js";

import mongoose from "mongoose";

const getAllStudents = async (req, res) => {
  const {
    _end,
    _order,
    _start,
    _sort,
    subject_like = "",
    year = "",
  } = req.query;

  const query = {};

  if (year !== "") {
    query.year = year;
  }

  // Search by subject
  if (subject_like) {
    query.subject = { $regex: subject_like, $options: "i" };
  }

  try {
    const count = await Student.countDocuments(query);

    const students = await Student.find(query)
      .limit(parseInt(_end))
      .skip(parseInt(_start))
      .sort({ [_sort]: _order });

    res.header("x-total-count", count);
    res.header("Access-Control-Expose-Headers", "x-total-count");

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubjectYearStatistics = async (req, res) => {
  try {
    const subjects = await Student.aggregate([
      {
        $group: {
          _id: { subject: "$subject", year: "$year" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getStudentDetail = async (req, res) => {
  const { id } = req.params;
  const studentExist = await Student.findOne({ _id: id }).populate("tutor");

  if (studentExist) {
    res.status(200).json(studentExist);
  } else {
    res.status(404).json({ message: "Student not found" });
  }
};

const createStudent = async (req, res) => {
  try {
    const {
      studentName,
      parentName,
      gender,
      year,
      subject,
      baseRate,
      sessionHoursPerWeek,
      day,
      startTime,
      endTime,
      delivery,
      status,
      sessionType,
      sessionMode,
      contactNumber,
      source,
      email,
    } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.findOne({ email }).session(session);

    if (!user) throw new Error("User not found");

    const newStudent = await Student.create({
      studentName,
      parentName,
      gender,
      year,
      subject,
      baseRate,
      sessionHoursPerWeek,
      day,
      startTime,
      endTime,
      delivery,
      status,
      sessionType,
      sessionMode,
      contactNumber,
      source,
      tutor: user._id,
    });

    user.allStudents.push(newStudent._id);
    await user.save({ session });

    await session.commitTransaction();

    res.status(200).json({ message: "Student created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      studentName,
      parentName,
      gender,
      year,
      subject,
      baseRate,
      sessionHoursPerWeek,
      day,
      startTime,
      endTime,
      delivery,
      status,
      sessionType,
      sessionMode,
      contactNumber,
      source,
    } = req.body;

    await Student.findByIdAndUpdate(
      { _id: id },
      {
        studentName,
        parentName,
        gender,
        year,
        subject,
        baseRate,
        sessionHoursPerWeek,
        day,
        startTime,
        endTime,
        delivery,
        status,
        sessionType,
        sessionMode,
        contactNumber,
        source,
      }
    );

    res.status(200).json({ message: "Student updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const studentToDelete = await Student.findById({ _id: id }).populate(
      "tutor"
    );

    if (!studentToDelete) throw new Error("Student not found");

    const session = await mongoose.startSession();
    session.startTransaction();

    studentToDelete.remove({ session });
    studentToDelete.tutor.allStudents.pull(studentToDelete);

    await studentToDelete.tutor.save({ session });
    await session.commitTransaction();

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllStudents,
  getStudentDetail,
  createStudent,
  updateStudent,
  deleteStudent,
  getSubjectYearStatistics
};
