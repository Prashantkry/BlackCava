import { NextResponse } from 'next/server';
import connection from '@/utils/db';
import { ResultSetHeader } from 'mysql2';

// Named export for PUT method
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { productId, name, category, flavour, description, small, medium, large } = body;

    // Validate input fields
    if (!productId || !name || !category || !flavour || !description || !small || !medium || !large) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Update product in the database
    const [result] = await connection.execute<ResultSetHeader>(
      'UPDATE allProducts SET name = ?, category = ?, flavour = ?, description = ?, small = ?, medium = ?, large = ? WHERE productId = ?',
      [name, category, flavour, description, small, medium, large, productId]
    );

    // Check if any rows were affected (i.e., if the product was updated)
    if (result.affectedRows === 0) {
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
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
