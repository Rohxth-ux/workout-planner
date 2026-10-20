import Routine from "../models/Routine.js";
import User from "../models/User.js";
import { createError } from "../utils/error.js";

const validate = (body) => {
  if (!body.name || !body.name.trim()) return "Name is required";
  if (
    body.time !== undefined &&
    body.time !== "" &&
    (isNaN(body.time) || Number(body.time) < 0)
  )
    return "Minutes must be a positive number";
  return null;
};

export const createRoutine = async (req, res, next) => {
  try {
    const msg = validate(req.body);
    if (msg) return next(createError(400, msg));

    const routine = await Routine.create({
      name: req.body.name.trim(),
      time: req.body.time,
      description: req.body.description,
      author: req.user.id,
    });
    await User.findByIdAndUpdate(req.user.id, {
      $push: { routines: routine._id },
    });
    res.status(200).json(routine);
  } catch (err) {
    next(err);
  }
};

export const getRoutines = async (req, res, next) => {
  try {
    const routines = await Routine.find({ author: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(routines);
  } catch (err) {
    next(err);
  }
};

export const updateRoutine = async (req, res, next) => {
  try {
    const msg = validate(req.body);
    if (msg) return next(createError(400, msg));

    const routine = await Routine.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
      {
        $set: {
          name: req.body.name.trim(),
          time: req.body.time,
          description: req.body.description,
        },
      },
      { new: true }
    );
    if (!routine) return next(createError(404, "Routine not found"));
    res.status(200).json(routine);
  } catch (err) {
    next(err);
  }
};

export const deleteRoutine = async (req, res, next) => {
  try {
    const routine = await Routine.findOneAndDelete({
      _id: req.params.id,
      author: req.user.id,
    });
    if (!routine) return next(createError(404, "Routine not found"));
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { routines: routine._id },
    });
    res.status(200).json("Routine deleted");
  } catch (err) {
    next(err);
  }
};