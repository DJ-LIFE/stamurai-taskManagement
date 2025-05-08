"use client";
import { AppDispatch } from "@/app/store/store";
import { useDispatch } from "react-redux";
import AuthGuard from "@/app/components/AuthGuard";

const Dashboard = () => {
	const dispatch: AppDispatch = useDispatch();
	return (
		<AuthGuard>
			<section>
                <h2 className="text-center w-32 mx-auto mt-5 text-xs font-semibold text-neutral-600 rounded-full py-1 px-2 border shadow-2xl ">Dashboard</h2>
                <p className="text-5xl font-semibold">Welcome to your dashboard!</p>
            </section>
		</AuthGuard>
	);
};

export default Dashboard;
