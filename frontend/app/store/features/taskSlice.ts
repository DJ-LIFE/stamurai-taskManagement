import { taskService } from "@/app/services/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Task {
	_id: string;
	title: string;
	description: string;
	dueDate: string;
	priority: "low" | "medium" | "high";
	status: "not started" | "in progress" | "completed";
	assignedTo?: string;
	createdBy?: string;
	createdAt: string;
	updatedAt: string;
}

interface TaskState {
	tasks: Task[];
	currentTask: Task | null; // Fixed property name from currenttask to currentTask
	isLoading: boolean;
	error: string | null;
	filters: {
		status: string | null;
		priority: string | null;
		dueDate: string | null;
		searchTerm: string; // Fixed property name from searchterm to searchTerm
	};
}

const initialState: TaskState = {
	tasks: [],
	currentTask: null, // Fixed semicolon to comma
	isLoading: false,
	error: null,
	filters: {
		status: null,
		priority: null,
		dueDate: null,
		searchTerm: "", // Fixed property name from searchterm to searchTerm
	},
};

export const fetchTasks = createAsyncThunk(
	"tasks/fetchAll",
	async (_, { rejectWithValue }) => {
		try {
			return await taskService.getTasks();
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to fetch tasks"
			);
		}
	}
);

export const createTask = createAsyncThunk(
	"tasks/create",
	async (
		taskData: {
			title: string;
			description: string;
			dueDate: string;
			priority: string;
			status: string;
			assignedTo?: string;
			createdBy: string;
		},
		{ rejectWithValue }
	) => {
		try {
			// Fix: Keep dueDate as is, don't rename to dueData
			const apiTaskData = {
				...taskData,
				assignedTo: taskData.assignedTo || "",
			};
			return await taskService.createTask(apiTaskData);
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to create task"
			);
		}
	}
);

export const updateTask = createAsyncThunk(
	"tasks/update",
	async (
		{ taskId, taskData }: { taskId: string; taskData: Partial<Task> },
		{ rejectWithValue }
	) => {
		try {
			// Fix: No need to convert dueDate to dueData
			return await taskService.updateTask(taskId, taskData as any);
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to update task"
			);
		}
	}
);

export const deleteTask = createAsyncThunk(
	"tasks/delete",
	async (taskId: string, { rejectWithValue }) => {
		try {
			await taskService.deleteTask(taskId);
			return taskId;
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to delete task"
			);
		}
	}
);

export const getTaskById = createAsyncThunk(
	"tasks/getById",
	async (taskId: string, { rejectWithValue }) => {
		try {
			return await taskService.getTaskById(taskId);
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to fetch task"
			);
		}
	}
);

export const taskSlice = createSlice({
	name: "tasks",
	initialState,
	reducers: {
		clearTaskError: (state) => {
			state.error = null;
		},
		setFilter: (state, action) => {
			state.filters = { ...state.filters, ...action.payload };
		},
		clearFilters: (state) => {
			state.filters = {
				status: null,
				priority: null,
				dueDate: null,
				searchTerm: "",
			};
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch all tasks
			.addCase(fetchTasks.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchTasks.fulfilled, (state, action) => {
				state.isLoading = false;
				state.tasks = action.payload;
			})
			.addCase(fetchTasks.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			// Create task
			.addCase(createTask.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(createTask.fulfilled, (state, action) => {
				state.isLoading = false;
				state.tasks.push(action.payload);
			})
			.addCase(createTask.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			// Update task
			.addCase(updateTask.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateTask.fulfilled, (state, action) => {
				state.isLoading = false;
				const index = state.tasks.findIndex(
					(task) => task._id === action.payload._id
				);
				if (index !== -1) {
					state.tasks[index] = action.payload;
				}
				if (state.currentTask && state.currentTask._id === action.payload._id) {
					state.currentTask = action.payload;
				}
			})
			.addCase(updateTask.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			// Delete task
			.addCase(deleteTask.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(deleteTask.fulfilled, (state, action) => {
				state.isLoading = false;
				state.tasks = state.tasks.filter((task) => task._id !== action.payload);
				if (state.currentTask && state.currentTask._id === action.payload) {
					state.currentTask = null;
				}
			})
			.addCase(deleteTask.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			// Get task by ID
			.addCase(getTaskById.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(getTaskById.fulfilled, (state, action) => {
				state.isLoading = false;
				state.currentTask = action.payload;
			})
			.addCase(getTaskById.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			});
	},
});

export const { clearTaskError, setFilter, clearFilters } = taskSlice.actions;

export default taskSlice.reducer;
