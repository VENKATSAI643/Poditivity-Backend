// routes/taskRoutes.js
const express = require('express');
const { createTask, updateTask, getTasks } = require('../controllers/taskController');
const router = express.Router();

// Create a new task
router.post('/', createTask);

// Update an existing task
router.put('/:taskId', updateTask);

// Get all tasks for a user
router.get('/:userId', getTasks);

module.exports = router;
