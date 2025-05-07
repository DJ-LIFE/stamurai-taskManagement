import Google from "@/public/assets/Google";

const page = () => {
	return (
		<div className="flex justify-center items-center h-screen">
			<div className="min-w-80 md:min-w-100 border border-[#ccc] shadow-2xl p-8 rounded-lg space-y-4 pt-10 pb-30">
				<h2 className="text-2xl font-bold text-neutral-600">
					WELCOME BACK
				</h2>
				<div className="flex flex-col items-start gap-2">
					<label
						htmlFor="email"
						className="font-semibold text-neutral-800"
					>
						Email
					</label>
					<input
						type="email"
						className="p-2 border border-[#ccc] w-full rounded-md px-4"
					/>
				</div>
				<div className="flex flex-col items-start gap-2">
					<label
						htmlFor="password"
						className="font-semibold text-neutral-800"
					>
						password
					</label>
					<input
						type="password"
						className="p-2 border border-[#ccc] w-full rounded-md px-4"
					/>
				</div>
				<button className="py-2 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 cursor-pointer text-semibold shadow-lg text-white w-full mt-5">
					Submit
				</button>
				<button className="flex justify-center items-center w-full gap-2 text-sm font-semibold bg-neutral-200 p-2 rounded-lg shadow-lg cursor-pointer hover:bg-neutral-300">
					<span className="">
						<Google />
					</span>
					Signin
				</button>
			</div>
		</div>
	);
};

export default page;
