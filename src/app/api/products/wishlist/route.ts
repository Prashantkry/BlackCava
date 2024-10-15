import { NextRequest, NextResponse } from 'next/server';
import connection from '@/utils/db';

interface wishlistB {
    userId: number;
    productId: string;
}

export async function POST(req: NextRequest) {
    console.log("Add to Wishlist items API triggered");
    try {
        const items: wishlistB[] = await req.json();
        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ message: 'Invalid wishlist item data' }, { status: 400 });
        }
        await connection.query(`
            CREATE TABLE IF NOT EXISTS wishlists (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT NOT NULL,
                productId VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        const insertPromises = items.map(item => {
            const { userId, productId } = item;

            if (!userId || !productId) {
                throw new Error('Invalid wishlist item data');
            }

            return connection.query(
                'INSERT INTO cartItems (userId, productId) VALUES (?, ?)',
                [userId, productId]
            );
        });
        await Promise.all(insertPromises);
        return NextResponse.json({ message: 'Items added to wishlist successfully' }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ message: 'Error adding items to wishlist', error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    console.log("Get wishlist items API triggered");
    try {
        const [cartItems] = await connection.query('SELECT * FROM wishlists');
        return NextResponse.json({ cartItems: cartItems, status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching cart items', error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    console.log("Delete all cart items API triggered");
    try {
        const { userId } = await req.json(); 

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        await connection.query('DELETE FROM cartItems WHERE userId = ?', [userId]);
        return NextResponse.json({ message: 'All cart items deleted successfully' }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: 'Error deleting cart items', error: error.message }, { status: 500 });
    }
}

export async function DELETE_ONE(req: NextRequest) {
    console.log("Delete one cart item API triggered");
    try {
        const { userId, productId, size } = await req.json(); 

        if (!userId || !productId || !size) {
            return NextResponse.json({ message: 'User ID, Product ID, and Size are required' }, { status: 400 });
        }

        await connection.query(
            'DELETE FROM cartItems WHERE userId = ? AND productId = ? AND size = ?',
            [userId, productId, size]
        );
        return NextResponse.json({ message: 'Cart item deleted successfully' }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: 'Error deleting cart item', error: error.message }, { status: 500 });
    }
}
