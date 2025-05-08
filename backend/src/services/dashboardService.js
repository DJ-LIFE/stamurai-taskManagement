const taskModel = require("../model/taskModel");

/**
 * Get tasks assigned to a user
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} - Tasks assigned to the user
 */
const getTasksAssignedToUser = async (userId) => {
	return await taskModel
		.find({ assignedTo: userId })
		.populate("createdBy", "name email")
		.populate("assignedTo", "name email");
};

/**
 * Get tasks created by a user
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} - Tasks created by the user
 */
const getTasksCreatedByUser = async (userId) => {
	return await taskModel
		.find({ createdBy: userId })
		.populate("createdBy", "name email")
		.populate("assignedTo", "name email");
};

/**
 * Get overdue tasks for a user
 * @param {Array} tasks - List of tasks assigned to the user
 * @returns {Array} - Overdue tasks
 */
const getOverdueTasks = (tasks) => {
	return tasks.filter(
		(task) =>
			new Date(task.dueDate) < new Date() && task.status !== "completed"
	);
};

/**
 * Get complete dashboard data for a user
 * @param {string} userId - The ID of the user
 * @returns {Promise<Object>} - Dashboard data
 */
const getDashboardData = async (userId) => {
	const taskAssignedToMe = await getTasksAssignedToUser(userId);
	const taskCreatedByMe = await getTasksCreatedByUser(userId);
	const overdueTasks = getOverdueTasks(taskAssignedToMe);

	return {
		taskAssignedToMe,
		taskCreatedByMe,
		overdueTasks,
	};
};

module.exports = {
	getDashboardData,
	getTasksAssignedToUser,
	getTasksCreatedByUser,
	getOverdueTasks,
};
