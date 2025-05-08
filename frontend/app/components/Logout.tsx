"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { logoutUser } from "../store/features/authSlice";
import { useRouter } from "next/navigation";

const Logout = () => {
	const dispatch: AppDispatch = useDispatch();
	const router = useRouter();
	const isAuthenticated = useSelector(
		(state: RootState) => state.auth.isAuthenticated
	);

	const handleLogout = async () => {
		await dispatch(logoutUser());
		router.push("/login");
	};

	return (
		<header className="flex justify-center items-center p-4 bg-gray-800 text-white ">
			<div className="flex justify-between items-center w-full max-w-7xl mx-auto">
				<a href="/">
					<h1 className="text-xl font-semibold">Stamurai</h1>
				</a>
				{isAuthenticated && (
					<>
						<nav className="hidden md:block">
							<ul className="flex space-x-4">
								<li>
									<a href="/dashboard" className="font-semibold">Dashboard</a>
								</li>
								<li>
									<a href="/create-task" className="font-semibold">Create Task</a>
								</li>
							</ul>
						</nav>
						<div>
							<button
								onClick={() => router.push("/create-task")}
								className="bg-neutral-500 px-4 py-2 cursor-pointer rounded-lg mx-2 text-medium"
							>
								Create-task
							</button>
							<button
								className="bg-red-500 px-4 py-2 rounded cursor-pointer mx-2"
								onClick={handleLogout}
							>
								Logout
							</button>
						</div>
					</>
				)}
			</div>
		</header>
	);
};

export default Logout;
