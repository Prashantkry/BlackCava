import { NextResponse } from 'next/server';
import db from '@/utils/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (!productId) {
        return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    }

    try {
        const [rows] = await db.query<RowDataPacket[]>('SELECT id FROM allProducts WHERE productId = ?', [productId]);

        if (rows.length === 0) {
            return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
        }

        const id = rows[0].id;

        const [result] = await db.query<ResultSetHeader>('update allProducts set isDeleted = true WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ success: false, message: 'Product not found during deletion' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Product deleted successfully' });

    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
