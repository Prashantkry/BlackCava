import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const mongoUrl = process.env.NEXT_PUBLIC_MongoDB!;
const dbName = "blackCava";
const collectionName = "allProduct";

export async function GET(req: NextRequest) {
    console.log("Get 1 product api triggered");
    let client: MongoClient | null = null;
    const pId = req.nextUrl.searchParams.get("id")
    console.log("p id => ", pId)
    try {
        client = await MongoClient.connect(mongoUrl);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const product = await collection.findOne({ productId: pId });
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
        // console.log("product Data => ", product)
        return NextResponse.json({ product });
    } catch (err) {
        console.log(err)
    }
}