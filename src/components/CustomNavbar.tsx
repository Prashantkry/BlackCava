import { coffee0 } from '@/assets/Media'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const CustomNavbar = () => {
    return (
        <>
            <div
                className='flex items-center justify-around w-full h-[8vh] text-lg bg-black text-gray-200 shadow-lg font-bold'
            >
                <Link href="/">
                    {/* Black <span className='text-indigo-600 font-extrabold tracking-widest'>Cava</span> */}
                    <Image src={coffee0} alt='logo' width={50} height={50} />
                </Link>
                <Link href="/">Home </Link>
                <Link href="ServicePage">Services </Link>
                <Link href="AboutPage">About </Link>
                <Link href="ContactPage">Contact </Link>
            </div>
        </>
    )
}

export default CustomNavbar