import { UseFormRegister, FieldValues, FieldErrors, Path } from "react-hook-form";

interface FormField<T extends FieldValues> {
	label: string;
	placeholder: string;
	register: UseFormRegister<T>;
	name: Path<T>;
	errors?: FieldErrors<T>;
	type?: string;
}

const FormField = <T extends FieldValues>({
	register,
	label,
	placeholder,
	errors,
  name,
  type = "text"
}: FormField<T>) => {
	return (
		<div className="flex flex-col items-start gap-2">
			<label htmlFor={name} className="font-semibold text-neutral-800">
				{label}
			</label>
			<input
				id={name}
				type={type}
				className="p-2 border border-[#ccc] w-full rounded-md px-4"
				{...register(name)}
				placeholder={placeholder}
			/>
			{errors?.[label] && <span>{errors[name]?.message as string}</span>}
		</div>
	);
};

export default FormField;
