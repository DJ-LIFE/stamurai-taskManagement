import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/app/store/features/authSlice";
import dashboardReducer from "@/app/store/features/dashboardSlice";
import taskReducer from "@/app/store/features/taskSlice";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		dashboard: dashboardReducer,
		tasks: taskReducer,
	},
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState, dashboard: DashboardState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
