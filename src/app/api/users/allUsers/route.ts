import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const mongoUrl = process.env.NEXT_PUBLIC_MongoDB!;

export async function GET(req: NextRequest) {
  try {
    const client = new MongoClient(mongoUrl);
    await client.connect();
    const db = client.db('blackCava');
    const usersCollection = db.collection('customers');
    const users = await usersCollection.find().toArray();

    if (!users || users.length === 0) {
      return NextResponse.json({ success: false, message: 'No users found', status: 404 });
    }

    return NextResponse.json({ success: true, users, status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Internal server error', status: 500 });
  }
}
