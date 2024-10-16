import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

const mongoUrl = process.env.NEXT_PUBLIC_MongoDB!;
const database = "blackCava";
const collection = "cartItems";

// ! Add to cart items
export async function POST(req: NextRequest) {
    console.log("Add to Cart items API triggered");
    try {
        const items = await req.json();
        // console.log("cart items => ", items);
        const { customerEmail, productId, size, quantity } = items;

        if (!customerEmail || !productId || !size || quantity < 1) {
            return NextResponse.json({ message: 'Invalid cart item data' }, { status: 400 });
        }

        const client = new MongoClient(mongoUrl);
        await client.connect();
        const db = client.db(database);
        const cartCollection = db.collection(collection);
        await cartCollection.insertOne({
            customerEmail,
            productId,
            size,
            quantity,
            addedAt: new Date(),
        });
        await client.close();
        return NextResponse.json({ message: 'Items added to cart successfully' }, { status: 201 });
    } catch (error: any) {
        console.error("Error adding items to cart: ", error);
        return NextResponse.json({ message: 'Error adding items to cart', error: error.message }, { status: 500 });
    }
}

// ! Get all cart items
export async function GET(req: NextRequest) {
    console.log("Get Cart items API triggered");
    try {
        const client = new MongoClient(mongoUrl);
        await client.connect();
        const db = client.db(database);
        const cartCollection = db.collection(collection);
        const cartItems = await cartCollection.find({}).toArray();
        await client.close();
        return NextResponse.json({ cartItems, status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching cart items', error: error.message }, { status: 500 });
    }
}

// ! Update cart items
export async function PUT(req: NextRequest) {
    console.log("Update cart item API triggered");
    try {
        const { customerEmail, productId, size, quantity } = await req.json();
        if (!customerEmail || !productId || !size || quantity < 1) {
            return NextResponse.json({ message: 'Invalid cart item data', status: 400 });
        }
        const client = new MongoClient(mongoUrl);
        await client.connect();
        const result = await client.db(database).collection(collection).updateOne(
            { customerEmail, productId, size },
            { $set: { quantity } }
        );
        await client.close();
        if (result.matchedCount === 0) {
            return NextResponse.json({ message: 'Cart item not found', status: 404 });
        }
        return NextResponse.json({ message: 'Cart item updated successfully', status: 200 });
    } catch (error: any) {
        console.error("Error updating cart item:", error);
        return NextResponse.json({ message: 'Error updating cart item', error: error.message, status: 500 });
    }
}

// ! Delete cart items
export async function DELETE(req: NextRequest) {
    console.log("Delete wishlist items API triggered");
    try {
        const { customerEmail, productId, size } = await req.json();
        if (!customerEmail) {
            return NextResponse.json({ message: 'User ID is required', status: 400 });
        }
        const client = new MongoClient(mongoUrl);
        await client.connect();
        const result = await client.db(database).collection(collection).deleteMany(
            { customerEmail, productId, size }
        );
        await client.close();
        if (result.deletedCount === 0) {
            return NextResponse.json({ message: 'No wishlist items found', status: 404 });
        }
        return NextResponse.json({ message: 'Wishlist items deleted successfully', status: 200 });
    } catch (error: any) {
        console.error("Error deleting wishlist items:", error);
        return NextResponse.json({ message: 'Error deleting wishlist items', error: error.message, status: 500 });
    }
}
