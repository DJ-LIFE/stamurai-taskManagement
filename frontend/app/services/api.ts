import axios from "axios";

const API_URL = "http://localhost:8081/api/v1";
const api = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 50000,
});

api.interceptors.request.use(
	(config) => {
		const authStorage = localStorage.getItem("authStore");
		let token = null;
		if (authStorage) {
			try {
				const authState = JSON.parse(authStorage);
				token = authState.token; // Changed from authState.state?.token
			} catch (e) {
				console.error("Error parsing the auth Storage", e);
			}
		}

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			localStorage.removeItem("authStore");
			window.location.href = "/";
		}

		return Promise.reject(error);
	}
);

export const authService = {
	login: async (email: string, password: string) => {
		const response = await api.post("/login", { email, password });
		return response.data;
	},
	signup: async (name: string, email: string, password: string) => {
		const response = await api.post("/register", { name, email, password });
		return response.data;
	},
	logout: async () => {
		const response = await api.post("/logout");
		return response.data;
	},
	getUserProfile: async () => {
		const response = await api.get("/profile");
		return response.data;
	},
};
export const taskService = {
	createTask: async (taskData: {
		title: string;
		description: string;
		dueDate: string; // Changed from dueData to dueDate
		priority: string;
		status: string;
		createdBy: string;
		assignedTo: string;
	}) => {
		try {
			console.log("API service received task data:", taskData);

			const response = await api.post("/task", {
				title: taskData.title,
				description: taskData.description,
				dueDate: taskData.dueDate, // Changed from taskData.dueData to taskData.dueDate
				priority: taskData.priority,
				status: taskData.status,
				createdBy: taskData.createdBy,
				assignedTo: taskData.assignedTo || taskData.createdBy, // Fallback to creator if no assignee
			});

			console.log("API response:", response.data);
			return response.data;
		} catch (error) {
			console.error("API error:", error);
			throw error; // Re-throw to allow handling in component
		}
	},
	getTasks: async () => {
		const response = await api.get("/task");
		return response.data;
	},
	getTaskById: async (taskId: string) => {
		const response = await api.get(`/task/${taskId}`);
		return response.data;
	},
	updateTask: async (
		taskId: string,
		taskData: {
			title: string;
			description: string;
			dueDate: string; // Changed from dueData to dueDate
			priority: string;
			status: string;
			createdBy: string;
			assignedTo: string;
		}
	) => {
		const response = await api.put(`/task/${taskId}`, taskData);
		return response.data;
	},
	deleteTask: async (taskId: string) => {
		const response = await api.delete(`/task/${taskId}`);
		return response.data;
	},
};

export const dashboardService = {
	getDashboardData: async () => {
		const response = await api.get("/dashboard");
		return response.data;
	},
	getTasksAssignedToMe: async () => {
		const dashboardData = await dashboardService.getDashboardData();
		return dashboardData.taskAssignedToMe;
	},
	getTasksCreatedByMe: async () => {
		const dashboardData = await dashboardService.getDashboardData();
		return dashboardData.taskCreatedByMe;
	},
	getOverdueTasks: async () => {
		const dashboardData = await dashboardService.getDashboardData();
		return dashboardData.overdueTasks;
	},
};

export const userService = {
	getAllUsers: async () => {
		const response = await api.get("/user");
		return response.data;
	},
};
