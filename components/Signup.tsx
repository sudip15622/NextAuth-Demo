"use client"
import React, { useState, useEffect } from 'react'
import FormField from './FormField';
import { useForm } from 'react-hook-form'
import { SignupFormData, SignupValidFieldNames, SignupDataSchema } from '@/types/types';
import { handleSignup } from '@/actions/handleSignup';
import { handleProviderLogin } from '@/actions/handleLogin';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { BarLoader } from 'react-spinners';
import { FaBloggerB, FaGithub, FaCheckCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { MdCancel } from "react-icons/md";

type StatusType = "success" | "failure" | "nothing";

type FormParamsType = {
    status: StatusType;
    setStatus: React.Dispatch<React.SetStateAction<StatusType>>;
}

// Form component for the signup page.
const SignupForm = ({ status, setStatus }: FormParamsType) => {

    // Setting up the react hook form.
    const { register, handleSubmit, formState: { errors }, setError } = useForm<SignupFormData>({
        resolver: zodResolver(SignupDataSchema),
        mode: "onChange",
        reValidateMode: "onSubmit",
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    useEffect(() => {
        console.log(errors)
    }, [errors])

    // Submit function of data submit
    const onSubmit = async (data: SignupFormData) => {
        try {
            // Calling the server action for registering user.
            const result = await handleSignup(data);

            if (result.success) {
                // console.log(data);
                setStatus("success");
                return;
            }
            // Handling the server side error with proper field mapping.
            if (result.errors) {
                const errors = result.errors;
                // console.log(errors);
                const fieldErrorMapping: Record<string, SignupValidFieldNames> = {
                    name: "name",
                    email: "email",
                    password: "password",
                    confirmPassword: 'confirmPassword'
                };
                const fieldWithError = Object.keys(fieldErrorMapping).find(
                    (field) => errors[field]
                )
                if (fieldWithError) {
                    setError(fieldErrorMapping[fieldWithError], {
                        type: "server",
                        message: errors[fieldWithError]
                    })
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
            <FormField<SignupFormData>
                type='text'
                placeholder='Full Name'
                name='name'
                register={register}
                error={errors.name}
            />
            <FormField<SignupFormData>
                type='email'
                placeholder='Email Address'
                name='email'
                register={register}
                error={errors.email}
            />
            <FormField<SignupFormData>
                type='password'
                placeholder='Password'
                name='password'
                register={register}
                error={errors.password}
            />
            <FormField<SignupFormData>
                type='password'
                placeholder='Confirm Password'
                name='confirmPassword'
                register={register}
                error={errors.confirmPassword}
            />

            <button className='bg-[var(--foreground)] text-[var(--background)] w-full h-9 text=[.95rem] rounded-[4px] font-semibold flex items-center justify-center' type='submit'>Signup</button>
        </form>
    )
}

const Signup = () => {

    const [status, setStatus] = useState<StatusType>("nothing");

    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/login";

    // Redirecting the user on successful signup
    useEffect(() => {
        if (status === "success") {
            setTimeout(() => {
                router.push(callbackUrl);
            }, 2000);
        }
    }, [status])

    const handleOkClick = () => {
        if (status === "failure") {
            setStatus("nothing");
        }
    }

    // Calling server action for social signup as same as in the login page.
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
                        <h1 className='text-center text-xl font-semibold'>Signup to Blogger</h1>
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
                        <span className='bg-gray-300 w-[25%] h-[1px]'></span>
                        <span>or Signup with email</span>
                        <span className='bg-gray-300 w-[25%] h-[1px]'></span>
                    </div>
                    <SignupForm status={status} setStatus={setStatus} />
                </>
            ) : status === "success" ? (
                <div className='flex flex-col gap-y-10 w-full h-full justify-center items-center text-center'>
                    <div className='flex items-center justify-center text-9xl text-green-500'><FaCheckCircle /></div>
                    <h2 className='text-5xl font-semibold text-center '>Signup Successful!</h2>
                    <p className='text-gray-600 text-center text-xl'>Redirecting....</p>
                    <div className='flex items-center justify-center mt-5'><BarLoader color='green' width={200} /></div>
                </div>
            ) : (
                <div className='flex flex-col gap-y-5 text-center w-full h-full justify-center items-center'>
                    <div className='flex items-center justify-center text-8xl text-red-500'><MdCancel /></div>
                    <h2 className='text-3xl font-semibold text-center'>Something went wrong!!</h2>
                    <p className='text-gray-600 text-center text-xl'>Please try again after rewriting the fields.</p>
                    <button onClick={handleOkClick} className='bg-[var(--foreground)] text-[var(--background)] w-fit py-2 px-5 text=[.95rem] rounded-[4px] font-semibold flex items-center justify-center'>OK</button>
                </div>
            )}
            {status !== "success" && (
                <div className='flex gap-x-2 items-center justify-center'>
                    <span>Already have an account?</span>
                    <Link href={callbackUrl} className='text-[1.05rem] font-semibold'>Login</Link>
                </div>
            )}
        </div>
    )
}

export default Signup
