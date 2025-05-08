"use client";
import AuthGuard from "@/app/components/AuthGuard";

const Home = () => {
	return (
		<AuthGuard>
			<div className="flex justify-center items-center h-screen text-2xl">
				<div>DashBoard</div>
				<div>Create Task</div>
			</div>
		</AuthGuard>
	);
};

export default Home;
