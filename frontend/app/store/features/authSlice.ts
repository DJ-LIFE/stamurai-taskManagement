import { authService } from "@/app/services/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type User = {
	id: string;
	email: string;
	password: string;
};

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

const loadState = (): AuthState => {
	try {
		const authStore = localStorage.getItem("authStore");
		if (!authStore)
			return {
				user: null,
				token: null,
				isAuthenticated: false,
				isLoading: false,
				error: null,
			};

		return JSON.parse(authStore);
	} catch (e) {
		console.error("Error loading auth state from localStorage", e);
		return {
			user: null,
			token: null,
			isAuthenticated: false,
			isLoading: false,
			error: null,
		};
	}
};

const initialState: AuthState = loadState();
const saveState = (state: AuthState) => {
	try {
		localStorage.setItem("authStore", JSON.stringify(state));
	} catch (error) {
		console.log("Error saving with the state to localStorage");
	}
};
export const login = createAsyncThunk(
	"auth/login",
	async (
		{ email, password }: { email: string; password: string },
		{ rejectWithValue }
	) => {
		try {
			const data = await authService.login(email, password);
			return data;
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.message || "Login Failed");
		}
	}
);
export const register = createAsyncThunk(
	"auth/register",
	async (
		{
			name,
			email,
			password,
		}: { name: string; email: string; password: string },
		{ rejectWithValue }
	) => {
		try {
			const data = await authService.signup(name, email, password);
			return data;
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data?.message || "Registration Failed"
			);
		}
	}
);
export const logoutUser = createAsyncThunk(
	"auth/logout",
	async (_, { rejectWithValue }) => {
		try {
			await authService.logout();
			return null;
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.message || "Logout Failed");
		}
	}
);
export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		clearError: (state) => {
			state.error = null;
			saveState(state);
		},
	},
	extraReducers(builder) {
		builder
			//login Case
			.addCase(login.pending, (state) => {
				state.isLoading = true;
				state.error = null;
				saveState(state);
			})
			.addCase(login.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload.user;
				state.token = action.payload.token;
				state.isAuthenticated = true;
				saveState(state);
			})
			.addCase(login.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
				saveState(state);
			})

			// register Case
			.addCase(register.pending, (state) => {
				state.isLoading = true;
				state.error = null;
				saveState(state);
			})
			.addCase(register.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload.user;
				state.token = action.payload.token;
				state.isAuthenticated = true;
				saveState(state);
			})
			.addCase(register.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
				saveState(state);
			})
			// Logout case
			.addCase(logoutUser.fulfilled, (state) => {
				state.user = null;
				state.token = null;
				state.isAuthenticated = false;
				state.error = null;
				localStorage.removeItem("authStore");
			});
	},
});

// Action creators are generated for each case reducer function
export const { clearError } = authSlice.actions;

export default authSlice.reducer;
