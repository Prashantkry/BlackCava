import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connection from '@/utils/db';
import { RowDataPacket } from 'mysql2';
// ! Sign in API
export async function POST(req: NextRequest) {
    try {
        const { email, password }: { email: string; password: string } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required', status: 500 });
        }

        const [rows]: [RowDataPacket[], any] = await connection.query<RowDataPacket[]>('SELECT * FROM customers WHERE email = ?', [email]);
        const existingCustomer = rows[0];

        if (!existingCustomer) {
            return NextResponse.json({ message: 'Customer not found', status: 400 });
        }

        const isPasswordValid = await bcrypt.compare(password, existingCustomer.password);

        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid password', status: 500 });
        }

        return NextResponse.json({ message: 'Login successful', customerId: existingCustomer.id, status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: 'Error logging in customer', error: error.message, status: 500 });
    }
}
