const dashboardService = require("../services/dashboardService");

const dashboard = async (req, res) => {
	const userId = req.user._id || req.user.id; // Use _id or fall back to id

	try {
		const dashboardData = await dashboardService.getDashboardData(userId);
		return res.status(200).json(dashboardData);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

module.exports = {
	dashboard,
};
