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
		router.replace("/login");
	};

	return (
		<header className="flex justify-center items-center p-4 bg-gray-800 text-white ">
			<div className="flex justify-between items-center w-full max-w-7xl mx-auto">
				<h1 className="text-2xl">My App</h1>
				{isAuthenticated && (
					<button
						className="bg-red-500 px-4 py-2 rounded cursor-pointer"
						onClick={handleLogout}
					>
						Logout
					</button>
                    
				)}
			</div>
		</header>
	);
};

export default Logout;
