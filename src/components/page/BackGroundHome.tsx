"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "../ui/hero-highlight";
import { ThreeDCard } from "./ThreeDCard";
import Image from "next/image";
import { draw } from "@/assets/Media";
import { TextCard } from "./TextCard";

export function BackGroundHome() {
    return (
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
    );
}
