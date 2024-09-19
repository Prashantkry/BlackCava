"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "../ui/hero-highlight";
import { ThreeDCard } from "./ThreeDCard";
import Image from "next/image";
import { draw, shop4 } from "@/assets/Media";
import { TextCard } from "./TextCard";

export function BackGroundHome() {
    return (
        <>
            <section className="relative flex items-center justify-center min-h-screen bg-black">
                <Image
                    src={shop4}
                    alt="BlackCava Coffee"
                    layout="fill"
                    objectFit="cover"
                    className="z-0 opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10"></div>
                <div className="relative z-20 text-center px-4 sm:px-8">
                    <p className="mt-6 text-xl text-gray-300 sm:text-2xl animate-fadeInUp">
                        Crafting the perfect cup, one bean at a time.
                    </p>
                    <button className="mt-8 px-6 py-3 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-400 transition-transform transform hover:scale-105 duration-300">
                        Explore Now
                    </button>
                </div>
            </section>



            <HeroHighlight className="flex items-center justify-between w-full h-full">
            <motion.h1
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: [20, -5, 0],
                }}
                transition={{
                    duration: 0.5,
                    ease: [0.4, 0.0, 0.2, 1],
                }}
                className="text-2xl px-4 md:text-4xl lg:text-xl font-bold text-neutral-300 dark:text-black max-w-4xl leading-relaxed lg:leading-snug text-center w-[45%] mx-auto "
            >
                {/* Coffea canephora is less susceptible to disease than C. arabica and can be cultivated in lower altitudes and warmer climates where C. arabica will not thrive. */}

                {/* <span>Indulge in the rich, aromatic embrace of our signature...</span> */}
                <Highlight className="text-gray-200 border-0 text-[6rem] dark:text-white abftxt">
                    Black <span className='text-indigo-600 font-extrabold tracking-widest'>Cava</span>
                </Highlight>
                <TextCard />
            </motion.h1>
            <div className="w-fit mb-20 mr-20 border-0">
                <ThreeDCard />
            </div>
            {/* <Image className="absolute mt-[32vh] w-full" src={draw} alt="coffee" /> */}
        </HeroHighlight>
        </>
    );
}
