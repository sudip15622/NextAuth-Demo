"use client"
import React, { useState, useRef, useEffect } from 'react'
import { FormFieldProps } from '@/types/types'
import { BiHide, BiShow } from "react-icons/bi";

export const FormField = <T extends object>({ type, name, placeholder, register, error }: FormFieldProps<T>) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [showIcon, setShowIcon] = useState(false);

    const passwordRef = useRef<HTMLInputElement | null>(null);
    const iconRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (iconRef.current && !iconRef.current.contains(event.target as Node | null)) {
                passwordRef.current?.value === "" && setShowIcon(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [iconRef])

    const { ref, ...rest } = register(name);

    const isPasswordField = name === "password" || name === "confirmPassword";

    //function for focus event
    const handleFocus = () => {
        isPasswordField && setShowIcon(true);
    }

    return (
        <div className='relative flex flex-col w-full gap-y-2'>
            <div className='relative w-full' ref={iconRef}>
                <input
                    className='w-full shadow-[0_0_3px_gray] rounded-[4px] px-2 py-2'
                    type={type !== "password" ? type : isPasswordVisible ? "text" : "password"}
                    placeholder={placeholder}
                    onFocus={handleFocus}
                    ref={(e) => { passwordRef.current = e; ref(e); }}
                    {...rest}
                />

                {isPasswordField && showIcon && (
                    <span
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        className='absolute top-1/2 right-0 -translate-y-1/2 flex items-center justify-center p-2 text-xl text-gray-600 cursor-pointer'
                    >
                        {isPasswordVisible ? <BiHide /> : <BiShow />}
                    </span>
                )}
            </div>

            {error && (
                <div className="text-[.9rem] text-red-500">
                    {error.message}
                </div>
            )}
        </div>
    )
}

export default FormField;
