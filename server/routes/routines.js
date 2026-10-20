import express from "express";
import {
  createRoutine,
  getRoutines,
  updateRoutine,
  deleteRoutine,
} from "../controllers/routine.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", createRoutine);
router.get("/", getRoutines);
router.put("/:id", updateRoutine);
router.delete("/:id", deleteRoutine);

export default router;