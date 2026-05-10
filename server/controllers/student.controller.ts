import Student from "../mongodb/models/student";
import User from "../mongodb/models/user";

import mongoose, { FilterQuery } from "mongoose";
import { Request, Response } from "express";
import { getErrorMessage } from "../utils/error";
import { IStudent } from "../mongodb/models/student";
import { getQueryNumber, getQueryString } from "../utils/query";

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
  const subjectSearch = getQueryString(subject_like);
  const yearFilter = getQueryString(year);

  const query: FilterQuery<IStudent> = {};

  if (yearFilter) {
    query.year = yearFilter;
  }

  // Search by subject
  if (subjectSearch) {
    query.subject = { $regex: subjectSearch, $options: "i" };
  }

  try {
    if (!req.user) return res.status(401).json({ message: "Authentication required" });
    query.tutor = req.user._id;

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

const getSubjectYearStatistics = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Authentication required" });
    const subjects = await Student.aggregate([
      { $match: { tutor: req.user._id } },
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

const getSubjectDistribution = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Authentication required" });
    const subjects = await Student.aggregate([
      { $match: { tutor: req.user._id } },
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

const getYearGroupDistribution = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Authentication required" });
    const years = await Student.aggregate([
      { $match: { tutor: req.user._id } },
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
  if (!req.user) return res.status(401).json({ message: "Authentication required" });
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid student id" });
  }

  const studentExist = await Student.findOne({ _id: id, tutor: req.user._id }).populate("tutor");

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
    } = req.body;

    session.startTransaction();

    if (!req.user) throw new Error("Authentication required");

    const user = await User.findById(req.user._id).session(session);

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
    if (!req.user) return res.status(401).json({ message: "Authentication required" });
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student id" });
    }

    const allowedFields = [
      "studentName",
      "parentName",
      "gender",
      "year",
      "subject",
      "baseRate",
      "sessionHoursPerWeek",
      "day",
      "startTime",
      "endTime",
      "delivery",
      "status",
      "sessionType",
      "sessionMode",
      "contactNumber",
      "source",
    ];

    const updates = allowedFields.reduce<Record<string, unknown>>((result, field) => {
      const value = req.body[field];
      if (value !== undefined && value !== null && value !== "") {
        result[field] = value;
      }
      return result;
    }, {});

    if (!Object.keys(updates).length) {
      const studentExists = await Student.exists({ _id: id, tutor: req.user._id });
      if (!studentExists) {
        return res.status(404).json({ message: "Student not found" });
      }

      return res.status(200).json({ message: "Student updated successfully" });
    }

    const updatedStudent = await Student.findOneAndUpdate(
      { _id: id, tutor: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student updated successfully" });
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student id" });
    }

    const studentToDelete = await Student.findOneAndDelete({
      _id: id,
      tutor: req.user._id,
    });

    if (!studentToDelete) {
      return res.status(404).json({ message: "Student not found" });
    }

    await User.updateOne(
      { _id: req.user._id },
      { $pull: { allStudents: studentToDelete._id } }
    );

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) });
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
