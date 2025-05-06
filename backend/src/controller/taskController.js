const Task = require("../model/taskModel");
const createTask = async (req, res) => {
	const {
		title,
		description,
		dueDate,
		priority,
		status,
		createdBy,
		assignedTo,
	} = req.body;
	try {
		if (
			!title ||
			!dueDate ||
			!priority ||
			!status ||
			!createdBy ||
			!assignedTo
		) {
			return res.status(400).json({ message: "All fields are required" });
		}
		const task = await Task.create({
			title,
			description,
			dueDate,
			priority,
			status,
			createdBy,
			assignedTo,
		});
		return res.status(201).json({
			success: true,
			message: "Task created successfully",
			task,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "Failed to create task",
			error: error.message,
		});
	}
};

const getTasks = async (req, res) => {
	try {
		const tasks = await Task.find();
		return res.status(200).json({
			success: true,
			tasks,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "Failed to retrieve tasks",
			error: error.message,
		});
	}
};

const getTaskById = async (req, res) => {
	const { id } = req.params;
	try {
		const task = await Task.findById(id);
		if (!task) {
			return res.status(404).json({
				success: false,
				message: "Task not found",
			});
		}
		return res.status(200).json({
			success: true,
			task,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "Failed to retrieve task",
			error: error.message,
		});
	}
};

const updateTask = async (req, res) => {
	const { id } = req.params;
	const {
		title,
		description,
		dueDate,
		priority,
		status,
		createdBy,
		assignedTo,
	} = req.body;
	try {
		const task = await Task.findByIdAndUpdate(
			id,
			{
				title,
				description,
				dueDate,
				priority,
				status,
				createdBy,
				assignedTo,
			},
			{ new: true, runValidators: true }
		);

		if (!task) {
			return res.status(404).json({
				success: false,
				message: "Task not found",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Task updated successfully",
			task,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "Failed to update task",
			error: error.message,
		});
	}
};

const deleteTask = async (req, res) => {
	const { id } = req.params;
	try {
		const task = await Task.findByIdAndDelete(id);
		if (!task) {
			return res.status(404).json({
				success: false,
				message: "Task not found",
			});
		}
		return res.status(200).json({
			success: true,
			message: "Task deleted successfully",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "Failed to delete task",
			error: error.message,
		});
	}
};

module.exports = {
	createTask,
	getTasks,
	getTaskById,
	updateTask,
    deleteTask
};
