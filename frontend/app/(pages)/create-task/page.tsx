"use client";
import AuthGuard from "@/app/components/AuthGuard";

const CreateTask = () => {
	return (
		<AuthGuard>
			<div>CreateTask</div>
		</AuthGuard>
	);
};

export default CreateTask;
