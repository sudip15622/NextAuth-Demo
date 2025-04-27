import { FieldError, UseFormRegister, Path } from 'react-hook-form';
import { z, ZodType } from 'zod';

export type LoginFormData = {
    email: string;
    password: string;
}

export type SignupFormData = LoginFormData & {
    name: string;
    confirmPassword: string;
}

export type LoginValidFieldNames = "email" | "password";

export type SignupValidFieldNames = LoginValidFieldNames | "name" | "confirmPassword";

export type FormFieldProps<T extends object> = {
    name: Path<T>;
    type: string;
    placeholder: string;
    register: UseFormRegister<T>;
    error?: FieldError;
};

export const LoginDataSchema: ZodType<LoginFormData> = z.object({
    email: z.string().min(1, { message: "Email is required!" }).email({ message: "Invalid email!" }),
    password: z.string().min(1, { message: "Password is required!" }),
})

export const SignupDataSchema: ZodType<SignupFormData> = z.object({
    name: z.string().min(1, { message: "Name is required!" }).regex(/^[A-Za-z ]*$/, "Only alphabets and spaces allowed").refine((val) => /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(val.trim()), {
        message: "Name must only contain letters and single spaces between",
    }),
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid Email" }),
    password: z.string().min(8, { message: "Password is too short!" }).max(20, { message: "Password is too long!" }).regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
        "Password must contain at least one uppercase and lowercase letter, digit, and special character"
    ),
    confirmPassword: z.string().min(1, { message: "Confirm password is required!" })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match!",
    path: ["confirmPassword"],
});