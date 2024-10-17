import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
const mongoUrl = process.env.NEXT_PUBLIC_MongoDB!

export async function POST(req: NextRequest): Promise<NextResponse> {
    console.log("Add products API triggered");
    const body = await req.json();
    // console.log("Body => ", body);

    let client: MongoClient;
    client = await MongoClient.connect(mongoUrl)
    const db = client.db("blackCava");
    const collectionName = db.collection("allProduct");

    const { productId, name, category, flavour, description, image, sizes } = body;
    // console.log("product data -> ", productId, name, category, flavour, description, sizes)
    const { small, medium, large } = sizes;


    if (!productId || !name || !category || !flavour || !description || !small || !medium || !large) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    try {
        const product = {
            productId,
            name,
            category,
            flavour,
            description,
            image,
            sizes: { small, medium, large }
        }
        const inD = await collectionName.insertOne(product);
        console.log(inD)

        return NextResponse.json({ message: 'Product added successfully' }, { status: 200 });
    } catch (error) {
        console.error("Database operation failed:", error);
        return NextResponse.json({
            message: 'Database error',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    } finally {
        if (client) {
            await client.close();
        }
    }
}
