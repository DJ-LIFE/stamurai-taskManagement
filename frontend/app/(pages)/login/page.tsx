"use client";
import Google from "@/public/assets/Google";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import FormField from "@/app/components/FormField";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { login } from "@/app/store/features/authSlice";
import { AppDispatch } from "@/app/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const signInSchema = z.object({
	email: z.string().email(),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long" }),
});
type Login = z.infer<typeof signInSchema>;

const LoginComponent = () => {
	const dispatch: AppDispatch = useDispatch();
	const { isLoading, error, isAuthenticated } = useSelector(
		(state: RootState) => state.auth
	);
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Login>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	// Check if user is already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			router.push("/dashboard");
		}
	}, [isAuthenticated, router]);

	const onSubmit: SubmitHandler<Login> = async (data) => {
		try {
			// Dispatch login action directly
			const result = await dispatch(
				login({
					email: data.email,
					password: data.password,
				})
			).unwrap();

			// If login successful, redirect
			if (result) {
				router.push("/dashboard");
			}
		} catch (err) {
			console.error("Login failed:", err);
			// Error is already handled by the login rejected case
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
					<h2 className="text-2xl font-bold text-neutral-600">WELCOME BACK</h2>
					{error && (
						<div className="p-2 mb-4 text-sm bg-red-100 text-red-600 rounded-md">
							{error}
						</div>
					)}
					<form onSubmit={handleSubmit(onSubmit)}>
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
								{errors.email.message}
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
								{errors.password.message}
							</span>
						)}
						<button
							type="submit"
							className="py-2 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 cursor-pointer text-semibold shadow-lg text-white w-full mt-5"
						>
							Sign In
						</button>
						<button
							type="button" // Changed from "submit" to prevent form submission
							onClick={handleGoogleSignIn}
							className="flex justify-center items-center w-full gap-2 text-sm font-semibold bg-neutral-200 p-2 rounded-lg shadow-lg cursor-pointer hover:bg-neutral-300 mt-2"
						>
							<span className="">
								<Google />
							</span>
							Sign in with Google
						</button>
						<div className="text-center my-5 font-semibold">
							Dont have account{" "}
							<button
								className="hover:text-blue-600 cursor-pointer"
								onClick={() => router.push("/register")}
							>
								Signup
							</button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
};

export default LoginComponent;
