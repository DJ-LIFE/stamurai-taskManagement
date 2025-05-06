const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
	try {
		const token =
			req.cookies.token || req.headers["authorization"]?.split(" ")[1];
		if (!token) {
			return res
				.status(401)
				.json({ success: false, message: "Unauthorized" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res
				.status(401)
				.json({ success: false, message: "Unauthorized" });
		}

		req.user = {
			...decoded,
			_id: decoded.id,
		};

		next();
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

module.exports = authMiddleware;
