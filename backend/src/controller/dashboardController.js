const dashboard = async (req, res) => {
	const { userId } = req.user;
	try {
		const taskAssignedToMe = await taskModel
			.find({
				assignedTo: userId,
			})
			.populate("createdBy", "name email")
			.populate("assignedTo", "name email");

		if (!taskAssignedToMe || taskAssignedToMe.length === 0) {
			return res.status(404).json({ message: "No tasks found For you" });
		}
		const taskCreatedByMe = await taskModel
			.find({
				createdBy: userId,
			})
			.populate("createdBy", "name email")
			.populate("assignedTo", "name email");
		if (!taskCreatedByMe || taskCreatedByMe.length === 0) {
			return res.status(404).json({ message: "No tasks created by you" });
		}

		const pendingTaskAssignedToMe = taskAssignedToMe.map((task) => {
			return {
				...task._doc,
				status: task.status === "not started" ? "pending" : task.status,
			};
		});
		return res
			.status(200)
			.json({
				taskAssignedToMe,
				taskCreatedByMe,
				pendingTaskAssignedToMe,
			});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
};
