"use client";
import AuthGuard from "@/app/components/AuthGuard";
import FormField from "@/app/components/FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { taskService, userService } from "@/app/services/api";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { AppDispatch, RootState } from "@/app/store/store";
import { useDispatch, useSelector } from "react-redux";
import { createTask } from "@/app/store/features/taskSlice";
import { getUserId } from "@/app/store/features/authSlice";

// Simplified task schema that only validates fields we need for creation
const taskSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	dueDate: z.string().min(1, "Due date is required"),
	priority: z.enum(["low", "medium", "high"]),
	status: z.enum(["not started", "in progress", "completed"]),
	assignedTo: z.string().optional(),
	createdBy: z.string().optional(), // This will be set in the onSubmit function
});

interface User {
	_id: string;
	name: string;
	email: string;
	createdBy: string;
}

type Task = z.infer<typeof taskSchema>;
const CreateTask = () => {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [users, setUsers] = useState<User[]>([]);
	const dispatch: AppDispatch = useDispatch();
	const task = useSelector((state: RootState) => state.tasks);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
	} = useForm<Task>({
		resolver: zodResolver(taskSchema),
		defaultValues: {
			title: "",
			description: "",
			dueDate: "",
			priority: "low",
			status: "not started",
			assignedTo: "",
		},
	});
	console.log(watch());
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await userService.getAllUsers();
				if (response && response.users) {
					setUsers(response.users);
				}
			} catch (error) {
				console.error("Failed to fetch users:", error);
				toast.error("Failed to load users for assignment");
			}
		};

		fetchUsers();
	}, []);

	const onSubmit = async (data: Task) => {
		try {
			setIsSubmitting(true);

			// Get current user ID using the helper function
			const userId = getUserId();

			if (!userId) {
				toast.error("You must be logged in to create a task");
				router.push("/login");
				return;
			}

			// Set the created by field to current user
			const taskData = {
				...data,
				createdBy: userId,
				// If assignedTo is not provided, assign to self
				assignedTo: data.assignedTo || userId,
				// We keep the property as dueDate here as taskSlice will handle the renaming
				// The taskSlice will convert dueDate to dueData before sending to API
			};

			console.log("Sending task data:", taskData);

			// Dispatch the task creation action
			const resultAction = await dispatch(createTask(taskData));

			if (createTask.fulfilled.match(resultAction)) {
				toast.success("Task created successfully");
				reset();
				router.push("/dashboard");
			} else {
				toast.error("Failed to create task. Please try again.");
			}
		} catch (error: any) {
			console.error("Failed to create task:", error);
			// Enhanced error reporting
			const errorMessage =
				error.response?.data?.message ||
				"Failed to create task. Please try again.";
			toast.error(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<AuthGuard>
			<div className="p-4 max-w-4xl mx-auto">
				<h1 className="text-2xl font-bold mb-6">Create New Task</h1>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<FormField<Task>
							type="text"
							name="title"
							register={register}
							label="Task Name"
							placeholder="Enter task name"
							error={errors.title?.message} // Pass the error prop
						/>
						<FormField<Task>
							type="date"
							name="dueDate"
							register={register}
							label="Due Date"
							placeholder="Select due date"
							error={errors.dueDate?.message}
						/>
						<FormField<Task>
							type="select"
							name="priority"
							register={register}
							label="Priority"
							options={[
								{ value: "low", label: "Low" },
								{ value: "medium", label: "Medium" },
								{ value: "high", label: "High" },
							]}
							error={errors.priority?.message}
						/>
						<FormField<Task>
							type="select"
							name="status"
							register={register}
							label="Status"
							options={[
								{ value: "not started", label: "Not Started" },
								{ value: "in progress", label: "In Progress" },
								{ value: "completed", label: "Completed" },
							]}
							error={errors.status?.message}
						/>
						<div className="col-span-1 md:col-span-2">
							<FormField<Task>
								type="textarea"
								name="description"
								register={register}
								label="Description"
								placeholder="Enter task description"
								error={errors.description?.message}
							/>
						</div>
						{/* Add user selection for assignment */}
						<div className="col-span-1 md:col-span-2">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Assign to User
							</label>
							<select
								{...register("assignedTo")}
								className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="">Select a user to assign</option>
								{users.map((user) => (
									<option key={user._id} value={user._id}>
										{user.name} ({user.email})
									</option>
								))}
							</select>
							{errors.assignedTo && (
								<p className="text-red-500 text-xs mt-1">
									{errors.assignedTo.message}
								</p>
							)}
							<p className="text-xs text-gray-500 mt-1">
								Leave blank to assign to yourself
							</p>
						</div>
					</div>
					<div className="flex justify-end">
						<button
							type="submit"
							// disabled={isSubmitting}
							className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 cursor-pointer"
						>
							{/* {isSubmitting ? "Creating..." : "Create Task"} */}
							Create Task
						</button>
					</div>
				</form>
			</div>
		</AuthGuard>
	);
};

export default CreateTask;
