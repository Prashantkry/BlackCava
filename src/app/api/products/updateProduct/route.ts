import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const mongoUrl = process.env.NEXT_PUBLIC_MongoDB!;

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { productId, name, category, flavour, description, small, medium, large } = body;
    console.log("product data -> ", productId, name, category, flavour, description, small, medium, large);

    if (!productId || !name || !category || !flavour || !description || !small || !medium || !large) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    let client: MongoClient | null = null;

    try {
      client = await MongoClient.connect(mongoUrl);
      const db = client.db("blackCava");
      const collection = db.collection("allProduct");

      const result = await collection.updateOne(
        { productId },
        {
          $set: {
            name,
            category,
            flavour,
            description,
            sizes: { small, medium, large }
          }
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { success: false, message: 'Product not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { success: true, message: 'Product updated successfully' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Database operation failed:', error);
      return NextResponse.json(
        { success: false, message: 'Internal server error' },
        { status: 500 }
      );
    } finally {
      if (client) {
        await client.close();
      }
    }
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
