import { dashboardService } from "@/app/services/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface DashboardData {
	assignedTasks: number;
	createdtasks: number;
	overdueTasks: number;
	todoTasks: number;
	inProgressTasks: number;
	completedTasks: number;
}

interface DashboardState {
	data: DashboardData | null;
	isLoading: boolean;
	error: string | null;
}

const initialState: DashboardState = {
	data: null,
	isLoading: false,
	error: null,
};

export const fetchDashboardData = createAsyncThunk(
	"dashboard/fetchData",
	async (_, { rejectWithValue }) => {
		try {
			return await dashboardService.getDashboardData();
		} catch (error: any) {
			return rejectWithValue(error.response?.data);
		}
	}
);

export const dashboardSlice = createSlice({
	name: "dashboard",
	initialState,
	reducers: {
		clearDashboardError: (state) => {
			state.error = null;
		},
	},

	extraReducers: (builder) => {
		builder
			.addCase(fetchDashboardData.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchDashboardData.fulfilled, (state, action) => {
				state.isLoading = false;
				state.data = action.payload;
			})
			.addCase(fetchDashboardData.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			});
	},
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
