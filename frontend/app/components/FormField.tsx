import {
	UseFormRegister,
	FieldValues,
	FieldErrors,
	Path,
} from "react-hook-form";

interface FormField<T extends FieldValues> {
	label: string;
	placeholder?: string;
	register: UseFormRegister<T>;
	name: Path<T>;
	errors?: FieldErrors<T>;
	error?: string; // Add direct error message prop
	type?: string;
	options?: { value: string; label: string }[]; // Support for select options
}

const FormField = <T extends FieldValues>({
	register,
	label,
	placeholder = "",
	errors,
	error,
	name,
	type = "text",
	options = [],
}: FormField<T>) => {
	return (
		<div className="flex flex-col items-start gap-2 w-full">
			<label htmlFor={name} className="font-semibold text-neutral-800">
				{label}
			</label>

			{type === "textarea" ? (
				<textarea
					id={name}
					className="p-2 border border-[#ccc] w-full rounded-md px-4"
					{...register(name)}
					placeholder={placeholder}
				/>
			) : type === "select" ? (
				<select
					id={name}
					className="p-2 border border-[#ccc] w-full rounded-md px-4"
					{...register(name)}
				>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			) : (
				<input
					id={name}
					type={type}
					className="p-2 border border-[#ccc] w-full rounded-md px-4"
					{...register(name)}
					placeholder={placeholder}
				/>
			)}

			{/* Show error if provided directly or from errors object */}
			{(error || errors?.[name]?.message) && (
				<span className="text-red-500 text-sm">
					{error || (errors?.[name]?.message as string)}
				</span>
			)}
		</div>
	);
};

export default FormField;
