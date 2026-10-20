import express from "express";
import {
  createMeal,
  getMeals,
  updateMeal,
  deleteMeal,
} from "../controllers/meal.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", createMeal);
router.get("/", getMeals);
router.put("/:id", updateMeal);
router.delete("/:id", deleteMeal);

export default router;