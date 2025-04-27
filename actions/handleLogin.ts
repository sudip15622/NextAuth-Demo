"use server"

import { LoginFormData, LoginDataSchema } from "@/types/types"
import { prisma } from '@/lib/prisma';
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

interface LoginCredentialsInterface {
    success: boolean;
    errors?: { [k: string]: string };
    apiError?: string;
}

interface LoginProvidersInterface {
    success: boolean;
    apiError?: string;
}

export async function handleCredentialsLogin(data: LoginFormData): Promise<LoginCredentialsInterface> {

    try {
        const result = LoginDataSchema.safeParse(data);

        if (!result.success) {
            const serverErros = Object.fromEntries(
                result.error?.issues?.map((issue) => [issue.path[0], issue.message]) || []
            )

            return {
                success: false,
                errors: serverErros
            }
        }

        const user = await prisma.user.findFirst({
            where: { email: data.email }
        })

        if (!user) {
            return {
                success: false,
                errors: {
                    email: "This email doesn't exist here!"
                }
            }
        }
        if(!user.password) {
            return {
                success: false,
                errors: {
                    password: "Incorrect password!"
                }
            }
        }

        const isPasswordMatch = await bcrypt.compare(data.password, user.password);

        if (!isPasswordMatch) {
            return {
                success: false,
                errors: {
                    password: "Incorrect password!"
                }
            }
        }

        await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false
        })

        return {
            success: true,
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            apiError: "Something went wrong!"
        }
    }

}

export async function handleProviderLogin(provider: "google" | "github", callbackUrl: string) {
    await signIn(provider, {
        redirectTo: callbackUrl,
        redirect: true
    });
}