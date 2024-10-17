import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

const mongoUrl = process.env.NEXT_PUBLIC_MongoDB!;
const dbName = "blackCava"; 
const collectionName = "allProduct";

export async function GET(req: NextRequest) {
    let client: MongoClient | null = null;

    try {
        client = await MongoClient.connect(mongoUrl);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const products = await collection.find({}).toArray();
        // return NextResponse.json({ success: true, data: products });
        const response = NextResponse.json({ success: true, data: products });
        response.headers.set('Cache-Control', 'no-store'); 
        return response;
    } catch (error) {
        console.error(error);

        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    } finally {
        if (client) {
            await client.close();
        }
    }
}
