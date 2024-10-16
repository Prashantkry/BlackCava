import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { MongoClient, ObjectId } from 'mongodb';

const mongoUrl = process.env.NEXT_PUBLIC_MongoDB!;

// ! Get user by ID
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const customerEmail = searchParams.get('email');
  // console.log("customerEmail => ", customerEmail);

  if (!customerEmail) {
    return NextResponse.json({ success: false, message: 'User ID is required', status: 400 });
  }

  try {
    const client = new MongoClient(mongoUrl);
    await client.connect();
    const db = client.db('blackCava');
    const usersCollection = db.collection('customers');

    const user = await usersCollection.findOne({ email: customerEmail });
    // console.log("User => ", user);

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found', status: 404 });
    }

    return NextResponse.json({ success: true, user, status: 200 });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', status: 500 });
  }
}



// ! Update user by ID and password 
export async function PUT(req: NextRequest) {
  console.log("Update user API triggered");

  const { userData, passD, customerEmail } = await req.json();
  // console.log("userData => ", userData, "customerEmail => ", customerEmail, "passD => ", passD);
  console.log("customerEmail => ", customerEmail, "passD => ", passD);

  if (!customerEmail) {
    return NextResponse.json({ success: false, message: 'User email is required', status: 400 });
  }

  const client = new MongoClient(mongoUrl);
  await client.connect();
  const db = client.db('blackCava');
  const usersCollection = db.collection('customers');

  if (passD !== undefined) {
    console.log("Password update triggered");
    try {
      const hashedPassword = await bcrypt.hash(passD, 10);
      await usersCollection.updateOne(
        { email: customerEmail },
        { $set: { password: hashedPassword } }
      );
      return NextResponse.json({ success: true, message: 'Password updated successfully', status: 200 });
    } catch (error) {
      console.error('Error updating password:', error);
      return NextResponse.json({ success: false, message: 'Internal server error', status: 500 });
    }
  }

  const { name, email, phoneNumber, addressLine1, city, state, pinCode, profilePic } = userData;
  try {
    await usersCollection.updateOne(
      { email: customerEmail },
      {
        $set: {
          name,
          email,
          phoneNumber,
          addressLine1,
          city,
          state,
          pinCode,
          profilePic
        }
      }
    );
    return NextResponse.json({ success: true, message: 'User updated successfully', status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', status: 500 });
  } finally {
    await client.close();
  }
}
