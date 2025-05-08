const userService = require("../services/userService");

const signup = async (req, res) => {
	const { name, email, password } = req.body;
	try {
		const { token } = await userService.createuser(name, email, password);
		const isProduction = process.env.NODE_ENV === "production";
		res.cookie("token", token, { httpOnly: true, secure: isProduction });

		res.status(201).json({
			success: true,
			message: "User created successfully",
			token,
			user: name,
			email,
		});
	} catch (error) {
		console.error(error);
		if (
			error.message === "All fields are required" ||
			error.message === "Password must be at least 8 characters long" ||
			error.message === "User already exists"
		) {
			return res.status(400).json({ message: error.message });
		}

		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

const signin = async (req, res) => {
	const { email, password } = req.body;
	try {
		const { token } = await userService.loginUser(email, password);
		if (!token) {
			return res.status(401).json({ message: "Invalid credentials" });
		}
		const isProduction = process.env.NODE_ENV === "production";
		res.cookie("token", token, { httpOnly: true, secure: isProduction });

		res.status(200).json({
			success: true,
			message: "User signed in successfully",
			token,
		});
		console.log("User signed in successfully", token);
	} catch (error) {
		console.error(error);
		if (
			error.message === "All fields are required" ||
			error.message === "Invalid credentials"
		) {
			return res
				.status(400)
				.json({ success: false, message: error.message });
		}
		if (error.message === "User not found") {
			return res
				.status(404)
				.json({ success: false, message: error.message });
		}
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

const logout = async (req, res) => {
	try {
		res.clearCookie("token");
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

const getAllUsers = async (req, res) => {
	try {
		const users = await userService.getAllUsers();
		res.status(200).json({
			success: true,
			users,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

module.exports = {
	signup,
	signin,
	logout,
	getAllUsers,
};
