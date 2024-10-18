"use client";

import Image from "next/image";
import { shop4 } from "@/assets/Media";

export function BackGroundHome() {
    const handleHome = () => {
        window.location.href = '/ProductsPage';
    }
    return (
        <section className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden">
            {/* Background Image */}
            <Image
                src={shop4}
                alt="BlackCava Coffee"
                layout="fill"
                objectFit="cover"
                className="absolute inset-0 z-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10"></div>
            <div className="relative z-20 text-center mt-[40vh] sm:mt-10 px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 lg:py-24 flex flex-col items-center">
                <p className="text-3xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-teal-300 font-semibold mb-4 sm:mb-6 md:mb-8 lg:mb-10 leading-tight animate-fadeInUp satisfy-regular">
                    Crafting the Perfect Cup, One Bean at a Time.
                </p>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-300 mb-6 sm:mb-8 md:mb-10 lg:mb-12 leading-relaxed mx-4 sm:mx-6 md:mx-8 lg:mx-12 max-w-4xl">
                    Immerse yourself in a coffee experience where every sip tells a story. From sourcing the finest beans to expert roasting, we bring you unparalleled quality.
                </p>
                <button onClick={handleHome} className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-yellow-500 text-black font-semibold rounded-full shadow-lg hover:bg-yellow-400 hover:shadow-xl transition-transform transform hover:scale-105 duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-300">
                    Explore Now
                </button>
            </div>
        </section>
    );
}
