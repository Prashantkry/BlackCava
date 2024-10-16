import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from "next/server";

const mongoUrl = process.env.NEXT_PUBLIC_MongoDB!;

// ! Get all orders
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId');

    if (!customerId) {
        return NextResponse.json({ success: false, message: 'Customer ID is required' }, { status: 400 });
    }

    let client: MongoClient | null = null;
    try {
        client = await MongoClient.connect(mongoUrl);
        const db = client.db('blackCava');
        const customersCollection = db.collection('customers');

        const customer = await customersCollection.findOne({ email: customerId });

        if (!customer) {
            return NextResponse.json({ success: false, message: 'Customer not found' }, { status: 404 });
        }
        const orders = customer.orders || [];

        return NextResponse.json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    } finally {
        client?.close();
    }
}
