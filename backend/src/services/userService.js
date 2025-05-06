const jwt = require("jsonwebtoken");
const User = require("../model/user");
const bcrypt = require("bcryptjs");

class UserService {
	async createuser(name, email, password) {
		if (!name || !email || !password) {
			throw new Error("All fields are required");
		}

		if (password.length < 8) {
			throw new Error("Password must be at least 8 characters long");
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			throw new Error("User already exists");
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({ name, email, password: hashedPassword });
		await user.save();

		const token = this.generateToken(user._id, email);

		return { user, token };
	}

	async loginUser(email, password) {
		if (!email || !password) {
			throw new Error("All fields are required");
		}

		const user = await User.findOne({ email });
		if (!user) {
			throw new Error("User not found");
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			throw new Error("Invalid credentials");
		}

		const token = this.generateToken(user._id, email);
		return { user, token };
	}

	generateToken(id, email) {
		return jwt.sign({ id, email }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});
	}
}

module.exports = new UserService();
