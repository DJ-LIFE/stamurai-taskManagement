"use client";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const isAuthenticated = useSelector(
		(state: RootState) => state.auth.isAuthenticated
	);

	useEffect(() => {
		if (!isAuthenticated) {
			router.replace("/login");
		}
	}, [isAuthenticated, router]);

	// Only render children if authenticated, otherwise render nothing
	// The useEffect will redirect to login page
	return isAuthenticated ? <>{children}</> : null;
}
