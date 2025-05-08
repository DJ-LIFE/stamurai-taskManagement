const Task = require("../model/taskModel");
class TaskService {
	async createTask(
		title,
		description,
		status,
		dueDate,
		priority,
		createdBy,
		assignedTo
	) {
		if (
			!title ||
			!dueDate ||
			!priority ||
			!status ||
			!createdBy ||
			!assignedTo
		) {
			throw new Error("All fields are required");
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
		if (!task) {
			throw new Error("Failed to create task");
		}
		return task;
	}

	async getTasks() {
		const tasks = await Task.find()
			.populate("createdBy", "name email")
			.populate("assignedTo", "name email");
		if (!tasks) {
			throw new Error("No tasks found");
		}
		return tasks;
	}

	async getTaskById(id) {
		const task = await Task.findById(id)
			.populate("createdBy", "name email")
			.populate("assignedTo", "name email");
		if (!task) {
			throw new Error("Task not found");
		}
		return task;
	}

	async updateTask(
		id,
		title,
		description,
		dueDate,
		priority,
		status,
		createdBy,
		assignedTo
	) {
		const updates = {
			title,
			description,
			dueDate,
			priority,
			status,
			createdBy,
			assignedTo,
		};
		const task = await Task.findByIdAndUpdate(id, updates, {
			new: true,
			runValidators: true,
		})
			.populate("createdBy", "name email")
			.populate("assignedTo", "name email");
		if (!task) {
			throw new Error("Task not found");
		}
		return task; // Return the updated task
	}

	async deleteTask(id) {
		const task = await Task.findByIdAndDelete(id);
		if (!task) {
			throw new Error("Task not found");
		}
		return task;
	}
}

module.exports = new TaskService();
