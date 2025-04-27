"use client"
import React, { useEffect } from 'react'

import { FaBloggerB, FaGithub, FaCheckCircle } from "react-icons/fa";
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth'

const Navbar = ({ session }: { session: Session | null }) => {

    useEffect(() => {
        console.log(session);
    }, [session])

    const handleSignOut = async () => {
        await signOut()
    }


    return (
        <header className='w-full py-4 sticky top-0'>
            <nav className='w-full max-w-7xl mx-auto flex items-center justify-between'>
                <Link href={"/"} className='flex items-center gap-x-2'>
                    <span className='flex items-center justify-center text-4xl'><FaBloggerB /></span>
                    <span className='font-bold text-xl'>Blogger</span>
                </Link>

                {!session ? (
                    <div className='flex items-center justify-center gap-x-5'>
                        <Link href={"/login"} className='bg-[var(--foreground)] text-[var(--background)] w-[120px] h-9 text=[.95rem] rounded-[4px] font-semibold flex items-center justify-center'>Log In</Link>
                        <Link href={"/signup"} className='bg-[var(--foreground)] text-[var(--background)] w-[120px] h-9 text=[.95rem] rounded-[4px] font-semibold flex items-center justify-center'>Sign Up</Link>
                    </div>
                ) : (
                    <button className='bg-[var(--foreground)] text-[var(--background)] w-[120px] h-9 text=[.95rem] rounded-[4px] font-semibold flex items-center justify-center' onClick={(e) => handleSignOut()}>Log Out</button>
                )}

            </nav>
        </header>
    )
}

export default Navbar
