// controllers/taskController.js
const Task = require('../models/taskModel');

// Create a new task
exports.createTask = async (req, res) => {
    try {
        const { title, description, userId } = req.body;

        const newTask = new Task({ title, description, userId });
        await newTask.save();

        // Emit task creation notification (if using Socket.io)
        req.app.io.emit('taskCreated', newTask);

        res.status(201).json({
            message: 'Task created successfully',
            task: newTask
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to create task',
            error
        });
    }
};

// Update an existing task
exports.updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description, status ,userId} = req.body;

        const updatedTask = await Task.findByIdAndUpdate(taskId, {
            title,
            description,
            status,
            userId,
            updatedAt: Date.now()
        }, { new: true });

        // Emit task update notification (if using Socket.io)
        req.app.io.emit('taskUpdated', updatedTask);

        res.status(200).json({
            message: 'Task updated successfully',
            task: updatedTask
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update task',
            error
        });
    }
};

// Get all tasks for a user
exports.getTasks = async (req, res) => {
    try {
        const { userId } = req.params;
        const tasks = await Task.find({ userId });

        res.status(200).json({
            message: 'Tasks retrieved successfully',
            tasks
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve tasks',
            error
        });
    }
};
