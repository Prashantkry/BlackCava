import { NextRequest, NextResponse } from "next/server";
import connection from '@/utils/db';

// ! Get all orders
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId');
    try {
        const [rows] = await connection.query('SELECT * FROM orderDetails where customerId = ?', [customerId]);
        return NextResponse.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}