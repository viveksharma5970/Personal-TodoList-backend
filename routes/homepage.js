// routes/todos.js
import express from "express";
import { Todo } from "../models/todos.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();


router.post("/", verifyToken, async (req, res) => {
  try {
    const todo = await Todo.create({
      ...req.body,
      userId: req.userId,
    });

    res.status(201).json(todo);
  } catch (err) {
    console.error("Error creating todo:", err);
    res.status(500).json({ msg: "Failed to create todo", error: err.message });
  }
});


// READ All Todos
router.get("/", verifyToken, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId }).sort({ dueDate: 1 });
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch todos", error: err.message });
  }
});

// UPDATE Todo
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updated = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ msg: "Todo not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update", error: err.message });
  }
});

// DELETE Todo
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!deleted) return res.status(404).json({ msg: "Todo not found" });
    res.status(200).json({ msg: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete", error: err.message });
  }
});

// TOGGLE Completion
router.put("/:id/toggle", verifyToken, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.userId });
    if (!todo) return res.status(404).json({ msg: "Todo not found" });

    todo.completed = !todo.completed;
    await todo.save();

    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({ msg: "Toggle failed", error: err.message });
  }
});


export default router;
