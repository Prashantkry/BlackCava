"use client"
import Link from "next/link";
import { useEffect, useState } from "react";

const SuccessPage = () => {
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 py-16 text-white">
            <div className="max-w-md text-center flex flex-col items-center justify-center space-y-5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="size-[50px] animate-pulse"><path fill="#33804a" d="M0 112.5L0 422.3c0 18 10.1 35 27 41.3c87 32.5 174 10.3 261-11.9c79.8-20.3 159.6-40.7 239.3-18.9c23 6.3 48.7-9.5 48.7-33.4l0-309.9c0-18-10.1-35-27-41.3C462 15.9 375 38.1 288 60.3C208.2 80.6 128.4 100.9 48.7 79.1C25.6 72.8 0 88.6 0 112.5zM288 352c-44.2 0-80-43-80-96s35.8-96 80-96s80 43 80 96s-35.8 96-80 96zM64 352c35.3 0 64 28.7 64 64l-64 0 0-64zm64-208c0 35.3-28.7 64-64 64l0-64 64 0zM512 304l0 64-64 0c0-35.3 28.7-64 64-64zM448 96l64 0 0 64c-35.3 0-64-28.7-64-64z" /></svg>
                <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
                <p className="text-gray-300 mb-6">
                    Thank you for your purchase. Your payment was processed successfully.
                </p>

                <Link href="/"
                    className="inline-block bg-green-600 px-6 py-3 rounded-lg font-semibold text-black hover:bg-green-500 transition duration-300 ease-in-out"
                >
                    Back to Home
                </Link>

                <div className="mt-8 text-gray-400">
                    {windowWidth >= 1024 ? (
                        <p>Continue shopping on your large screen!</p>
                    ) : (
                        <p>Optimized for mobile and tablet browsing!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
