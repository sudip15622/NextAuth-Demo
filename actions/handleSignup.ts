"use server"
import { SignupFormData, SignupDataSchema } from "@/types/types";
import { prisma } from '@/lib/prisma';
import bcrypt from "bcryptjs";

// type UserData = Omit<SignupFormData, 'confirmPassword'>

interface SignupApiInterface {
    success: boolean;
    errors?: { [k: string]: string };
    apiError?: string;
}


export async function handleSignup(data: SignupFormData): Promise<SignupApiInterface> {
    try {

        const result = SignupDataSchema.safeParse(data);

        if (!result.success) {
            const serverErrors = Object.fromEntries(
                result.error?.issues?.map((issue) => [issue.path[0], issue.message])
            )

            return {
                success: false,
                errors: serverErrors
            }
        }

        const user = await prisma.user.findFirst({
            where: { email: data.email }
        })

        if (user) {
            return {
                success: false,
                errors: {
                    email: "This email already exits!"
                }
            }
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                accounts: {
                    create: {
                        provider: "credentials",
                        providerAccountId: "credentials", // Required but not used for credentials
                        type: "credentials", // Must match your Account model's type
                    }
                }
            }
        })

        return {
            success: true
        }

    } catch (error) {
        console.log(error);
        return {
            success: false,
            apiError: "Something went wrong!"
        }
    }
}