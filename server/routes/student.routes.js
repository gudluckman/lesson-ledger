import express from "express";

import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getStudentDetail,
  updateStudent,
  getSubjectYearStatistics,
} from "../controllers/student.controller.js";

const router = express.Router();

router.route("/").get(getAllStudents);
router.route("/").post(createStudent);
router.route("/:id").get(getStudentDetail);
router.route("/:id").delete(deleteStudent);
router.route("/:id").patch(updateStudent);
router.route("/statistics/subject").get(getSubjectYearStatistics);

export default router;
