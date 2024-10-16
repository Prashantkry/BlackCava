import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const mongoUrl = process.env.NEXT_PUBLIC_MongoDB!;

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (!productId) {
        return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    }

    let client: MongoClient | null = null;

    try {
        client = await MongoClient.connect(mongoUrl);
        const db = client.db("blackCava");
        const collection = db.collection("allProduct");

        const result = await collection.deleteOne({ productId });

        if (result.deletedCount === 0) {
            return NextResponse.json({ success: false, message: 'Product not found during deletion' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Product deleted successfully' });

    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    } finally {
        if (client) {
            await client.close();
        }
    }
}
