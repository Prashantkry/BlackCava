// src/app/api/products/deleteProduct/route.ts

import { NextResponse } from 'next/server';
import db from '@/utils/db'; // Adjust the path as needed
import { ResultSetHeader } from 'mysql2'; // Import the type for better TypeScript support

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); // Get the id from the query string

    if (!id) {
        return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    }

    try {
        // Perform the DELETE operation
        const [result] = await db.query<ResultSetHeader>('DELETE FROM allProducts WHERE id = ?', [id]);

        // Access the affectedRows property correctly
        if (result.affectedRows === 0) {
            return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
