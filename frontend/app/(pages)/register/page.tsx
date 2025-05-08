"use client";
import FormField from "@/app/components/FormField";
import React, { useEffect } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import Google from "@/public/assets/Google";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { register as registerUser } from "@/app/store/features/authSlice";
import { useRouter } from "next/navigation"; // Fixed: next/navigation instead of next/router

const signUpSchema = z.object({
	name: z.string().min(3, "Name must be atleast 3 characters long"),
	email: z
		.string({ message: "Email required" })
		.email()
		.regex(/^[^@]+@[^@]+\.[^@]+$/, { message: "email required" }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long" }),
});
type SignUp = z.infer<typeof signUpSchema>;

const Register = () => {
	const dispatch: AppDispatch = useDispatch();
	const { isLoading, error, isAuthenticated } = useSelector(
		(state: RootState) => state.auth
	);
	const router = useRouter();

	useEffect(() => {
		if (isAuthenticated) {
			router.push("/dashboard");
		}
	}, [isAuthenticated, router]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUp>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const onSubmit: SubmitHandler<SignUp> = async (data) => {
		try {
			// Fixed: Using registerUser instead of register to avoid naming conflict
			const result = await dispatch(
				registerUser({
					name: data.name,
					email: data.email,
					password: data.password,
				})
			).unwrap();

			// If registration successful, redirect
			if (result) {
				router.push("/dashboard");
			}
		} catch (err) {
			console.error("Registration failed:", err);
			// Error is already handled by the register rejected case
		}
	};

	const handleGoogleSignIn = (e: React.MouseEvent) => {
		e.preventDefault();
		// Implement Google sign-in logic here
		console.log("Google sign-in clicked");
	};

	return (
		<div className="flex justify-center items-center h-screen">
			{isLoading ? (
				<div className="flex items-center justify-center">
					<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-800"></div>
				</div>
			) : (
				<div className="min-w-80 md:min-w-100 border border-[#ccc] shadow-2xl p-8 rounded-lg space-y-4 pt-10 pb-30">
					<h2 className="text-2xl font-bold text-neutral-600">
						CREATE ACCOUNT
					</h2>
					{error && (
						<div className="p-2 mb-4 text-sm bg-red-100 text-red-600 rounded-md">
							{error}
						</div>
					)}
					<form onSubmit={handleSubmit(onSubmit)}>
						<FormField
							type="text"
							label="Name"
							name="name"
							placeholder="Enter your name..."
							register={register}
							errors={errors}
						/>
						{errors.name && (
							<span className="text-sm font-medium text-red-500">
								{errors.name?.message}
							</span>
						)}
						<FormField
							type="email"
							label="Email"
							name="email"
							placeholder="Enter your email"
							register={register}
							errors={errors}
						/>
						{errors.email && (
							<span className="text-sm font-medium text-red-500">
								{errors.email?.message}
							</span>
						)}
						<FormField
							name="password"
							type="password"
							label="Password"
							placeholder="Enter Password..."
							register={register}
						/>
						{errors.password && (
							<span className="text-sm font-medium text-red-500">
								{errors.password?.message}
							</span>
						)}
						<button
							type="submit"
							className="py-2 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 cursor-pointer text-semibold shadow-lg text-white w-full mt-5"
						>
							Sign Up
						</button>
						<button
							type="button"
							onClick={handleGoogleSignIn}
							className="flex justify-center items-center w-full gap-2 text-sm font-semibold bg-neutral-200 p-2 rounded-lg shadow-lg cursor-pointer hover:bg-neutral-300 mt-2"
						>
							<span className="">
								<Google />
							</span>
							Sign in with Google
						</button>
						<div className="text-center my-5 font-semibold">
							Already have an account?{" "}
							<button
								type="button"
								className="hover:text-blue-600 cursor-pointer"
								onClick={() => router.push("/login")}
							>
								Login
							</button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
};

export default Register;
