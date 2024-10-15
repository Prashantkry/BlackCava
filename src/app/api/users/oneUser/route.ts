import { NextRequest, NextResponse } from 'next/server';
import connection from '@/utils/db';
import bcrypt from 'bcryptjs';

// ! Get user by ID
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('id');
  if (!userId) {
    return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
  }
  try {
    const [rows, fields]: [any[], any[]] = await connection.query('SELECT * FROM customers WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}


// ! Update user by ID and password 
export async function PUT(req: NextRequest) {
  console.log("Update user API triggered");
  const { userData, passD, customerId } = await req.json();
  console.log("userData => ", userData, "customerId => ", customerId, "passD => ", passD);
  if (!customerId) {
    return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
  }

  // * update password if passD is present
  if (passD!=undefined) {
    console.log("password update triggered");
    try {
      const hashedPassword = await bcrypt.hash(passD, 10);
      await connection.query('UPDATE customers SET password = ? WHERE id = ?', [hashedPassword, customerId]);
      return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
      console.error('Error updating password:', error);
      return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
  }

  // * update user data
  const { name, email, phoneNumber, addressLine1, city, state, pinCode, profilePic } = userData;
  try {
    await connection.query(
      'UPDATE customers SET name = ?, email = ?, phoneNumber = ?, addressLine1 = ?, city = ?, state = ?, pinCode = ?, profilePic = ? WHERE id = ?',
      [name, email, phoneNumber, addressLine1, city, state, pinCode, profilePic, customerId]
    );
    return NextResponse.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}