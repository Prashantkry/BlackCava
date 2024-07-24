"use client";
import React from "react";
import {
    TextRevealCard,
    TextRevealCardDescription,
    TextRevealCardTitle,
} from "../ui/text-reveal-card"

export function TextCard() {
    return (
        <div className="flex items-center justify-center bg-[#0E0E10] h-fit rounded-2xl mt-[10vh] w-full">
            <TextRevealCard
                text="You know the chemistry"
                revealText="I know the business"
            >
                <TextRevealCardTitle>
                    Sometimes, you just need to taste it.
                </TextRevealCardTitle>
                <TextRevealCardDescription>
                    Create delicious memories with each cup
                </TextRevealCardDescription>
            </TextRevealCard>
        </div>
    );
}
