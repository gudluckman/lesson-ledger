import express from "express";

import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getStudentDetail,
  updateStudent,
  getSubjectYearStatistics,
  getSubjectDistribution,
  getYearGroupDistribution
} from "../controllers/student.controller.js";

const router = express.Router();

router.route("/").get(getAllStudents);
router.route("/").post(createStudent);
router.route("/:id").get(getStudentDetail);
router.route("/:id").delete(deleteStudent);
router.route("/:id").patch(updateStudent);
router.route("/statistics/subject").get(getSubjectYearStatistics);
router.route("/statistics/subject-distribution").get(getSubjectDistribution);
router.route("/statistics/year-group-distribution").get(getYearGroupDistribution);

export default router;
