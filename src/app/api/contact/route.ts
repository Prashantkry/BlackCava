import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const emailAdmin = process.env.NEXT_PUBLIC_EMAIL_ADMIN || "your-email@gmail.com";
const passwordE = process.env.NEXT_PUBLIC_PASSWORD_E || "your-email-password";

export async function POST(req: NextRequest, res: NextResponse) {
    console.log("Contact API triggered");

    const { email, message } = await req.json();

    if (!email || !message) {
        return NextResponse.json({ error: "Email and message are required" }, { status: 400 });
    }

    // Nodemailer setup for sending the email from your Gmail account
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: emailAdmin,
            pass: passwordE,
        },
    });

    const mailOptions = {
        from: email,
        to: emailAdmin,
        subject: "Message from BlackCava",
        text: `Customer's email: ${email}\n\nMessage: ${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
}