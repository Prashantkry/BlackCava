import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const mongoUrl = process.env.NEXT_PUBLIC_MongoDB!;

export async function POST(req: NextRequest) {
    try {
        const { email, password }: { email: string; password: string } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        let client: MongoClient | null = null;

        try {
            client = await MongoClient.connect(mongoUrl);
            const db = client.db("blackCava");
            const collection = db.collection("customers");

            const existingUser = await collection.findOne({ email });

            if (existingUser) {
                return NextResponse.json({ message: 'Email is already registered' }, { status: 400 });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const result = await collection.insertOne({
                name: "",
                email,
                password: hashedPassword,
                phoneNumber: null,
                addressLine1: "",
                city: "",
                state: "",
                pinCode: "",
                profilePic: null,
                created_at: new Date(),
                orders: []
            });

            return NextResponse.json({ message: 'Customer registered successfully', email, status: 201 });
        } catch (error: any) {
            console.error('Error registering customer:', error);
            return NextResponse.json({ message: 'Internal server error', status: 500 });
        } finally {
            if (client) {
                await client.close();
            }
        }
    } catch (error: any) {
        console.error('Error processing request:', error);
        return NextResponse.json({ message: 'Error registering customer', status: 500 });
    }
}
