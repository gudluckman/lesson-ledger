import express from "express";
import Student from "../mongodb/models/student";
import User from "../mongodb/models/user";

import mongoose from "mongoose";

interface StudentQuery {
  year?: string;
  subject?: { $regex: string; $options: string };
}

interface StudentRequest {
  query: StudentQuery;
  params: { id: string };
  body: {
    studentName: string;
    parentName: string;
    gender: string;
    year: string;
    subject: string;
    baseRate: number;
    sessionHoursPerWeek: number;
    day: string;
    startTime: string;
    endTime: string;
    delivery: string;
    status: string;
    sessionType: string;
    sessionMode: string;
    contactNumber: string;
    source: string;
    email?: string;
  };
}

const getAllStudents = async (req: express.Request<StudentRequest>, res: express.Response) => {
  const {
    _end,
    _order,
    _start,
    _sort,
    subject_like = "",
    year = "",
  } = req.query;

  const query: StudentQuery = {};

  if (typeof year === "string" && year !== "") {
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getSubjectYearStatistics = async (req: express.Request, res: express.Response) => {
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

const getSubjectDistribution = async (req: express.Request, res: express.Response) => {
  try {
    const subjects = await Student.aggregate([
      {
        $group: {
          _id: {
            $cond: {
              if: { $regexMatch: { input: "$subject", regex: /Mathematics/ } },
              then: "Mathematics",
              else: "$subject",
            },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(subjects);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getYearGroupDistribution = async (req: express.Request, res: express.Response) => {
  try {
    const years = await Student.aggregate([
      {
        $group: {
          _id: "$year",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(years);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

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
  getSubjectYearStatistics,
  getSubjectDistribution,
  getYearGroupDistribution
};