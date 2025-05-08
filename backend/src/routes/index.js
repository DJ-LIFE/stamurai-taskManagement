const express = require("express");
const {
	signup,
	signin,
	logout,
	getAllUsers,
} = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");
const {
	createTask,
	getTasks,
	getTaskById,
	updateTask,
	deleteTask,
} = require("../controller/taskController");
const { dashboard } = require("../controller/dashboardController");
const router = express.Router();

router.post("/register", signup);
router.post("/login", signin);
router.post("/logout", authMiddleware, logout);

// User routes
router.get("/user", authMiddleware, getAllUsers);

// task routes
router.post("/task", authMiddleware, createTask);
router.get("/task", authMiddleware, getTasks);
router.get("/task/:id", authMiddleware, getTaskById);
router.put("/task/:id", authMiddleware, updateTask);
router.delete("/task/:id", authMiddleware, deleteTask);

// Dashboard route
router.get("/dashboard", authMiddleware, dashboard);

module.exports = router;
