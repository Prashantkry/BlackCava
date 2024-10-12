import { NextRequest, NextResponse } from 'next/server';
import connection from '@/utils/db'; 

// ! Get all products
export async function GET(req: NextRequest) {
    try {
      const [rows] = await connection.query('SELECT * FROM allProducts');
      return NextResponse.json({ success: true, data: rows });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
  }