import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const mongoUrl = process.env.NEXT_PUBLIC_MongoDB!;

export async function POST(req: NextRequest) {
    try {
        const { email, password }: { email: string; password: string } = await req.json();
        // console.log("email => ", email, "password => ", password);

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required', status: 400 });
        }

        let client: MongoClient | null = null;

        try {
            client = await MongoClient.connect(mongoUrl);
            const db = client.db("blackCava");
            const collection = db.collection("customers");

            const existingCustomer = await collection.findOne({ email });
            // console.log("existingCustomer => ", existingCustomer);

            if (!existingCustomer) {
                return NextResponse.json({ message: 'Customer not found', status: 400 });
            }

            const isPasswordValid = await bcrypt.compare(password, existingCustomer.password);

            if (!isPasswordValid) {
                return NextResponse.json({ message: 'Invalid password', status: 401 });
            }

            return NextResponse.json({ message: 'Login successful', email, status: 200 });
        } catch (error: any) {
            console.error('Error logging in customer:', error);
            return NextResponse.json({ message: 'Internal server error', status: 500 });
        } finally {
            if (client) {
                await client.close();
            }
        }
    } catch (error: any) {
        console.error('Error processing request:', error);
        return NextResponse.json({ message: 'Error logging in customer', error: error.message, status: 500 });
    }
}
