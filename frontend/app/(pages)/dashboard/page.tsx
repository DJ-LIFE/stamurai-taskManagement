"use client";
import { useEffect, useState } from "react";
import { dashboardService } from "@/app/services/api";
import AuthGuard from "@/app/components/AuthGuard";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface User {
	_id: string;
	name: string;
	email: string;
}

interface Task {
	_id: string;
	title: string;
	description: string;
	dueDate: string;
	priority: string;
	status: string;
	createdBy: User;
	assignedTo: User;
	createdAt: string;
	updatedAt: string;
}

const Dashboard = () => {
	const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
	const [createdTasks, setCreatedTasks] = useState<Task[]>([]);
	const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("assigned");

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				const dashboardData = await dashboardService.getDashboardData();
				setAssignedTasks(dashboardData.taskAssignedToMe || []);
				setCreatedTasks(dashboardData.taskCreatedByMe || []);
				setOverdueTasks(dashboardData.overdueTasks || []);
			} catch (error) {
				console.error("Failed to fetch dashboard data:", error);
				toast.error("Failed to load dashboard data");
			} finally {
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "completed":
				return "bg-green-100 text-green-800";
			case "in progress":
				return "bg-blue-100 text-blue-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority.toLowerCase()) {
			case "high":
				return "bg-red-100 text-red-800";
			case "medium":
				return "bg-yellow-100 text-yellow-800";
			case "low":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const isOverdue = (dueDate: string, status: string) => {
		return new Date(dueDate) < new Date() && status !== "completed";
	};

	const renderTaskList = (tasks: Task[]) => {
		if (tasks.length === 0) {
			return (
				<div className="text-center py-8 text-gray-500">No tasks found</div>
			);
		}

		return (
			<div className="grid grid-cols-1 gap-4">
				{tasks.map((task) => (
					<div
						key={task._id}
						className="border rounded-lg p-4 bg-white shadow-sm"
					>
						<div className="flex justify-between items-start mb-2">
							<h3 className="text-lg font-medium">{task.title}</h3>
							<div className="flex space-x-2">
								<span
									className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
										task.status
									)}`}
								>
									{task.status}
								</span>
								<span
									className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
										task.priority
									)}`}
								>
									{task.priority}
								</span>
							</div>
						</div>
						<p className="text-gray-600 text-sm mb-3 line-clamp-2">
							{task.description}
						</p>
						<div className="flex flex-wrap justify-between text-xs text-gray-500">
							<div>
								<span>Due: </span>
								<span
									className={
										isOverdue(task.dueDate, task.status)
											? "text-red-500 font-semibold"
											: ""
									}
								>
									{formatDate(task.dueDate)}
								</span>
							</div>
							<div>
								{activeTab === "assigned" && (
									<span>Created by: {task.createdBy?.name || "Unknown"}</span>
								)}
								{activeTab === "created" && (
									<span>
										Assigned to: {task.assignedTo?.name || "Unassigned"}
									</span>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
		);
	};

	return (
		<AuthGuard>
			<div className="p-4 max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold">My Dashboard</h1>
					<Link
						href="/create-task"
						className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
					>
						Create New Task
					</Link>
				</div>

				<div className="mb-6">
					<div className="border-b border-gray-200">
						<nav className="-mb-px flex space-x-8">
							<button
								onClick={() => setActiveTab("assigned")}
								className={`py-4 px-1 border-b-2 font-medium text-sm ${
									activeTab === "assigned"
										? "border-blue-500 text-blue-600"
										: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
								}`}
							>
								Assigned to Me ({assignedTasks.length})
							</button>
							<button
								onClick={() => setActiveTab("created")}
								className={`py-4 px-1 border-b-2 font-medium text-sm ${
									activeTab === "created"
										? "border-blue-500 text-blue-600"
										: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
								}`}
							>
								Created by Me ({createdTasks.length})
							</button>
							<button
								onClick={() => setActiveTab("overdue")}
								className={`py-4 px-1 border-b-2 font-medium text-sm ${
									activeTab === "overdue"
										? "border-blue-500 text-blue-600"
										: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
								}`}
							>
								Overdue Tasks ({overdueTasks.length})
							</button>
						</nav>
					</div>
				</div>

				{loading ? (
					<div className="flex justify-center items-center h-64">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
					</div>
				) : (
					<div className="bg-gray-50 p-4 rounded-lg">
						{activeTab === "assigned" && renderTaskList(assignedTasks)}
						{activeTab === "created" && renderTaskList(createdTasks)}
						{activeTab === "overdue" && renderTaskList(overdueTasks)}
					</div>
				)}
			</div>
		</AuthGuard>
	);
};

export default Dashboard;
