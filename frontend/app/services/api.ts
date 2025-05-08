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

