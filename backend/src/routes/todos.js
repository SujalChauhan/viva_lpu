const express = require('express');
const Todo = require('../models/Todo');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Get all todos for user
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.userId });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new todo
router.post('/', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const todo = new Todo({ text, user: req.userId });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a todo
router.put('/:id', auth, async (req, res) => {
  try {
    const { text, completed } = req.body;
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { text, completed },
      { new: true }
    );
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a todo
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 