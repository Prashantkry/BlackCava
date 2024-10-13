import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connection from '@/utils/db';

// ! Sign up API
export async function POST(req: NextRequest) {
    try {
        const { email, password }: { email: string; password: string } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required', status: 400 });
        }
        await connection.query(`
            CREATE TABLE IF NOT EXISTS customers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) default null,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                phoneNumber VARCHAR(50) default null,
                addressLine1 VARCHAR(255) default null,
                city VARCHAR(100) default null,
                state VARCHAR(100) default null,
                pinCode VARCHAR(20) default null,
                profilePic MEDIUMTEXT default null,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        const [existingCustomer] = await connection.query('SELECT * FROM customers WHERE email = ?', [email]);
        if (Array.isArray(existingCustomer) && existingCustomer.length > 0) {
            return NextResponse.json({ message: 'Customer already exists', status: 409 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const result: any = await connection.query(
            'INSERT INTO customers (email, password) VALUES (?, ?)',
            [
                email,
                hashedPassword,
            ]
        );
        return NextResponse.json({ message: 'Customer registered successfully', customerId: result.insertId, status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error registering customer', error: error.message, status: 500 });
    }
}