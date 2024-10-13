"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const backendUrl: string = process.env.NEXT_PUBLIC_BackendUrl!;
console.log("backendUrl => ", backendUrl)

const Page = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`${backendUrl}/api/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, message }),
            });

            const result = await response.json();

            if (response.ok) {
                setResponseMessage("Message sent successfully!");
            } else {
                setResponseMessage(result.error || "Failed to send message.");
            }
        } catch (error) {
            console.error("Error:", error);
            setResponseMessage("An error occurred while sending the message.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-black w-full min-h-screen flex items-center justify-center px-4 sm:px-10">
            <div className="w-full mb-20 md:mb-0 sm:w-[80%] lg:w-[50%] mx-auto rounded md:rounded-2xl p-6 md:p-10 shadow-lg bg-black dark:bg-white border border-gray-700 dark:border-gray-300">
                {/* Company Name */}
                <h2 className="text-2xl md:text-4xl font-bold text-center text-white dark:text-black">
                    BlackCava
                </h2>
                <p className="text-neutral-400 dark:text-neutral-600 text-center mt-2">
                    Contact Us
                </p>

                <form className="mt-8" onSubmit={handleSubmit}>
                    <LabelInputContainer className="mb-6">
                        <Label htmlFor="email" className="text-neutral-400 dark:text-neutral-600">
                            Email
                        </Label>
                        <Input
                            id="email"
                            placeholder="Your email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-neutral-900 dark:bg-zinc-100 text-white dark:text-black"
                        />
                    </LabelInputContainer>

                    <LabelInputContainer className="mb-6">
                        <Label htmlFor="message" className="text-neutral-400 dark:text-neutral-600">
                            Message
                        </Label>
                        <textarea
                            id="message"
                            placeholder="Your message"
                            rows={5}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="resize-none w-full border border-gray-700 bg-neutral-900 text-white dark:bg-zinc-100 dark:text-black rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-500 transition duration-300"
                            required
                        />
                    </LabelInputContainer>

                    <button
                        className={cn(
                            "w-full py-3 text-white dark:text-black font-semibold rounded-md bg-gradient-to-r from-gray-700 to-gray-900 dark:bg-gradient-to-r dark:from-zinc-100 dark:to-zinc-300",
                            "hover:from-gray-600 hover:to-gray-800 dark:hover:from-zinc-300 dark:hover:to-zinc-400 transition-all duration-300",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Sending..." : "Send Message →"}
                    </button>

                    {responseMessage && (
                        <p className="mt-4 text-center text-sm text-gray-400 dark:text-gray-600">
                            {responseMessage}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};

export default Page;
