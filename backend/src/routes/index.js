const express = require("express");
const { signup, signin, logout } = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require("../controller/taskController");
const router = express.Router();

router.post("/register", signup);
router.post("/login", signin);
router.post("/logout", authMiddleware, logout);

// task routes
router.post("/task", authMiddleware, createTask);
router.get("/task", authMiddleware, getTasks);
router.get("/task/:id", authMiddleware, getTaskById);
router.put("/task/:id", authMiddleware, updateTask);
router.delete("/task/:id", authMiddleware, deleteTask); 

// Dashboard route



module.exports = router;
