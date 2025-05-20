"use client"
import React, { useState, useEffect } from 'react'
import { LoginFormData, LoginDataSchema, LoginValidFieldNames } from '@/types/types'
import FormField from './FormField'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { handleCredentialsLogin, handleProviderLogin } from '@/actions/handleLogin'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation';

import { BarLoader } from 'react-spinners';
import { FaBloggerB, FaGithub, FaCheckCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { MdCancel } from "react-icons/md";

type StatusType = "success" | "failure" | "nothing";

type FormParamsType = {
    status: StatusType;
    setStatus: React.Dispatch<React.SetStateAction<StatusType>>;
}

// Form component for the login page.
const LoginForm = ({ status, setStatus }: FormParamsType) => {


    // Setting up the react hook form 
    const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginFormData>({
        resolver: zodResolver(LoginDataSchema),
        mode: "onChange",
        reValidateMode: "onSubmit",
        defaultValues: {
            email: "",
            password: ""
        }
    });

    // Function for handleing form submit
    const onSubmit = async (data: LoginFormData) => {

        try {
            // Calling server action for login via credentials
            const result = await handleCredentialsLogin(data);

            if (result.success) {
                setStatus("success");
                return;
            }

            // Showing error in the client side with proper mapping of the form fields.
            if (result.errors) {
                const errors = result.errors;
                const fieldErrorMapping: Record<string, LoginValidFieldNames> = {
                    email: "email",
                    password: "password",
                };
                const fieldWithError = Object.keys(fieldErrorMapping).find(
                    (field) => errors[field]
                );

                if (fieldWithError) {
                    // Use the ValidFieldNames type to ensure the correct field names
                    setError(fieldErrorMapping[fieldWithError], {
                        message: errors[fieldWithError]
                    });
                }
            }

            if (result.apiError) {
                setStatus("failure");
            }
        } catch (error) {
            setStatus("failure");
        }
    }

    return (
        <form className='flex flex-col gap-y-5 w-full' onSubmit={handleSubmit(onSubmit)}>
            <FormField<LoginFormData>
                type='email'
                placeholder='Email Address'
                name='email'
                register={register}
                error={errors.email}
            />
            <FormField<LoginFormData>
                type='password'
                placeholder='Password'
                name='password'
                register={register}
                error={errors.password}
            />
            <button className='bg-[var(--foreground)] text-[var(--background)] w-full h-9 text=[.95rem] rounded-[4px] font-semibold flex items-center justify-center' type='submit'>Login</button>
        </form>
    )
}

const Login = () => {

    const [status, setStatus] = useState<StatusType>("nothing");
    const [nextAuthError, setNextAuthError] = useState<string>("");

    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const error = searchParams.get("error");

    useEffect(() => {
        // Handling OAuth error can be occured while signin up via social providers or credentials provider.
        if (error) {

            const errorMessages: Record<string, string> = {
                // OAuth errors (from NextAuth)
                OAuthAccountNotLinked: "Another account already exists with the same e-mail address.",
                AccessDenied: "You don't have permission to sign in.",
                // Credentials errors (from your server action)
                CredentialsSignin: "Invalid email or password, try again with valid credentials.",
                // Network/other errors
                NetworkError: "Could not connect to the server.",
                Default: "Login failed! Please try again.",
            };

            const errorMessage = error ? errorMessages[error] || errorMessages.Default : "";
            setNextAuthError(errorMessage);
            setStatus("failure");

        }
    }, [error])


    // Redirecting the user on successful login.
    useEffect(() => {
        if (status === "success") {
            setTimeout(() => {
                router.push(callbackUrl);
                router.refresh();
            }, 2000);
        }
    }, [status])


    const handleOkClick = () => {
        if (status === "failure") {
            setStatus("nothing");
        }
    }

    // Calling server action for social login.
    const handleSocialClick = async (provider: "google" | "github") => {
        try {
            await handleProviderLogin(provider, callbackUrl);

        } catch (error) {
            setStatus("failure");
        }
    }


    return (
        <div className='bg-gray-50 w-full mx-auto min-h-[80vh] my-20 lg:max-w-md flex flex-col items-center justify-center gap-y-8 rounded-xl py-10 px-14'>
            {status === "nothing" ? (
                <>
                    <header className='flex flex-col gap-y-2 items-center text-center'>
                        <div className='w-fit h-fit p-3 rounded-2xl flex items-center justify-center text-3xl bg-[var(--foreground)] text-[var(--background)]'><FaBloggerB /></div>
                        <h1 className='text-center text-xl font-semibold'>Login to Blogger</h1>
                    </header>
                    <div className='flex flex-col gap-y-5 w-full'>
                        <button onClick={() => handleSocialClick("google")} className='relative w-full h-10 text=[.95rem] rounded-[4px] font-semibold flex items-center justify-center shadow-[0_0_3px_gray] group'>
                            <span className='absolute top-1/2 left-2 -translate-y-1/2 text-2xl group-hover:translate-x-2 transition-all duration-400'><FcGoogle /></span>
                            Continue with Google
                        </button>
                        <button onClick={() => handleSocialClick("github")} className='relative w-full h-10 text=[.95rem] rounded-[4px] font-semibold flex items-center justify-center shadow-[0_0_3px_gray] group'>
                            <span className='absolute top-1/2 left-2 -translate-y-1/2 text-2xl group-hover:translate-x-2 transition-all duration-400'><FaGithub /></span>
                            Continue with Github
                        </button>
                    </div>

                    <div className='flex items-center w-full justify-between'>
                        <span className='bg-gray-300 w-[30%] h-[1px]'></span>
                        <span>or login with email</span>
                        <span className='bg-gray-300 w-[30%] h-[1px]'></span>
                    </div>
                    <LoginForm status={status} setStatus={setStatus} />
                </>
            ) : status === "success" ? (
                <div className='flex flex-col gap-y-10 w-full h-fit justify-center items-center text-center'>
                    <div className='flex items-center justify-center text-9xl text-green-500'><FaCheckCircle /></div>
                    <h2 className='text-5xl font-semibold text-center '>Login Successful!</h2>
                    <p className='text-gray-600 text-center text-xl'>Redirecting....</p>
                    <div className='flex items-center justify-center mt-5'><BarLoader color='green' width={200} /></div>
                </div>
            ) : (
                <div className='flex flex-col gap-y-5 text-center w-full h-full justify-center items-center'>
                    <div className='flex items-center justify-center text-8xl text-red-500'><MdCancel /></div>
                    <h2 className='text-3xl font-semibold text-center'>Something went wrong!</h2>
                    <p className='text-gray-600 text-center text-xl'>{nextAuthError !== "" ? nextAuthError : "Please try again after a while."}</p>
                    <button onClick={handleOkClick} className='bg-[var(--foreground)] text-[var(--background)] w-fit py-2 px-5 text=[.95rem] rounded-[4px] font-semibold flex items-center justify-center'>OK</button>
                </div>
            )}
            {status !== "success" && (
                <div className='flex gap-x-2 items-center justify-center'>
                    <span>Don&apos;t have an account?</span>
                    <Link href={`/signup?callbackUrl=/login?callbackUrl=${callbackUrl}`} className='text-[1.05rem] font-semibold'>Signup</Link>
                </div>
            )}
        </div>
    )
}

export default Login
