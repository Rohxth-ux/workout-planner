import Meal from "../models/Meal.js";
import User from "../models/User.js";
import { createError } from "../utils/error.js";

const isBad = (v) =>
  v !== undefined && v !== "" && v !== null && (isNaN(v) || Number(v) < 0);

const validate = (body) => {
  if (!body.name || !body.name.trim()) return "Name is required";
  if (isBad(body.time)) return "Minutes must be a positive number";
  if (isBad(body.calories)) return "Calories must be a positive number";
  return null;
};

export const createMeal = async (req, res, next) => {
  try {
    const msg = validate(req.body);
    if (msg) return next(createError(400, msg));

    const meal = await Meal.create({
      name: req.body.name.trim(),
      time: req.body.time,
      calories: req.body.calories || 0,
      category: req.body.category,
      author: req.user.id,
    });
    await User.findByIdAndUpdate(req.user.id, { $push: { meals: meal._id } });
    res.status(200).json(meal);
  } catch (err) {
    next(err);
  }
};

export const getMeals = async (req, res, next) => {
  try {
    const meals = await Meal.find({ author: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(meals);
  } catch (err) {
    next(err);
  }
};

export const updateMeal = async (req, res, next) => {
  try {
    const msg = validate(req.body);
    if (msg) return next(createError(400, msg));

    const meal = await Meal.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
      {
        $set: {
          name: req.body.name.trim(),
          time: req.body.time,
          calories: req.body.calories || 0,
          category: req.body.category,
        },
      },
      { new: true }
    );
    if (!meal) return next(createError(404, "Meal not found"));
    res.status(200).json(meal);
  } catch (err) {
    next(err);
  }
};

export const deleteMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findOneAndDelete({
      _id: req.params.id,
      author: req.user.id,
    });
    if (!meal) return next(createError(404, "Meal not found"));
    await User.findByIdAndUpdate(req.user.id, { $pull: { meals: meal._id } });
    res.status(200).json("Meal deleted");
  } catch (err) {
    next(err);
  }
};