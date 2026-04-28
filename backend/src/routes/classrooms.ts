import express from "express";
import {
  getClassrooms,
  createClassroom,
} from "../controllers/classroom.controller";

const router = express.Router();

router.route("/").get(getClassrooms).post(createClassroom);

export { router };