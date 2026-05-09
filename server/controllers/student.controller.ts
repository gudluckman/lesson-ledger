import Student from "../mongodb/models/student";
import User, { IUser } from "../mongodb/models/user";

import mongoose, { FilterQuery } from "mongoose";
import { Request, Response } from "express";
import { getErrorMessage } from "../utils/error";
import { IStudent } from "../mongodb/models/student";
import { getQueryNumber, getQueryString } from "../utils/query";

type PopulatedTutor = Omit<IStudent, "tutor"> & { tutor: IUser };

const getAllStudents = async (req: Request, res: Response) => {
  const {
    _end,
    _order,
    _start,
    _sort,
    subject_like = "",
    year = "",
  } = req.query;
  const sortField = getQueryString(_sort);
  const sortOrder = getQueryString(_order);
  const limit = getQueryNumber(_end);
  const skip = getQueryNumber(_start);

  const query: FilterQuery<IStudent> = {};

  if (year !== "") {
    query.year = year;
  }

  // Search by subject
  if (subject_like) {
    query.subject = { $regex: subject_like, $options: "i" };
  }

  try {
    const count = await Student.countDocuments(query);

    let studentsQuery = Student.find(query);
    if (limit !== undefined) studentsQuery = studentsQuery.limit(limit);
    if (skip !== undefined) studentsQuery = studentsQuery.skip(skip);
    if (sortField) {
      studentsQuery = studentsQuery.sort({
        [sortField]: sortOrder === "desc" ? -1 : 1,
      });
    }

    const students = await studentsQuery;

    res.header("x-total-count", count.toString());
    res.header("Access-Control-Expose-Headers", "x-total-count");

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

const getSubjectYearStatistics = async (_req: Request, res: Response) => {
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
    res.status(500).json({ message: getErrorMessage(error) });
  }
}

const getSubjectDistribution = async (_req: Request, res: Response) => {
  try {
    const subjects = await Student.aggregate([
      {
        $group: {
          _id: {
            $cond: {
              if: { $regexMatch: { input: "$subject", regex: /Mathematics/ } },
              then: "Mathematics",
              else: "$subject"
            }
          },
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

const getYearGroupDistribution = async (_req: Request, res: Response) => {
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
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

const getStudentDetail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const studentExist = await Student.findOne({ _id: id }).populate("tutor");

  if (studentExist) {
    res.status(200).json(studentExist);
  } else {
    res.status(404).json({ message: "Student not found" });
  }
};

const createStudent = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();

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

    session.startTransaction();

    const user = await User.findOne({ email }).session(session);

    if (!user) throw new Error("User not found");

    const [newStudent] = await Student.create(
      [
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
          tutor: user._id,
        },
      ],
      { session }
    );

    user.allStudents.push(newStudent._id);
    await user.save({ session });

    await session.commitTransaction();

    res.status(200).json({ message: "Student created successfully" });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    res.status(500).json({ message: getErrorMessage(error) });
  } finally {
    session.endSession();
  }
};

const updateStudent = async (req: Request, res: Response) => {
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
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

const deleteStudent = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;

    const studentToDelete = await Student.findById({ _id: id }).populate<{ tutor: IUser }>(
      "tutor"
    ) as PopulatedTutor | null;

    if (!studentToDelete) throw new Error("Student not found");

    session.startTransaction();

    await Student.deleteOne({ _id: id }).session(session);
    studentToDelete.tutor.allStudents.pull(studentToDelete._id);

    await studentToDelete.tutor.save({ session });
    await session.commitTransaction();

    res.status(200).json({ message: "Student deleted successfully" });
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
  getAllStudents,
  getStudentDetail,
  createStudent,
  updateStudent,
  deleteStudent,
  getSubjectYearStatistics,
  getSubjectDistribution,
  getYearGroupDistribution
};
