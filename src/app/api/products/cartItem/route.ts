import { NextRequest, NextResponse } from 'next/server';
import connection from '@/utils/db';

export async function POST(req: NextRequest) {
    console.log("Add to Cart items API triggered");
    try {
        const items = await req.json();
        console.log("cart items => ", items);

        const { userId, productId, size, quantity } = items;

        await connection.query(`
            CREATE TABLE IF NOT EXISTS cartItems (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT NOT NULL,
                productId VARCHAR(255) NOT NULL,
                size VARCHAR(50) NOT NULL,
                quantity INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        const insertQuery = 'INSERT INTO cartItems (userId, productId, size, quantity) VALUES (?, ?, ?, ?)';
        await connection.query(insertQuery, [userId, productId, size, quantity]);

        return NextResponse.json({ message: 'Items added to cart successfully' }, { status: 201 });
    } catch (error: any) {
        console.error("Error adding items to cart: ", error);
        return NextResponse.json({ message: 'Error adding items to cart', error: error.message }, { status: 500 });
    }
}


export async function GET(req: NextRequest) {
    console.log("Get Cart items API triggered");

    try {
        const [cartItems] = await connection.query('SELECT * FROM cartItems');
        return NextResponse.json({ cartItems: cartItems, status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching cart items', error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    console.log("Update cart item API triggered");
    try {
        const { userId, productId, size, quantity } = await req.json();

        if (!userId || !productId || !size || quantity < 1) {
            return NextResponse.json({ message: 'Invalid cart item data' }, { status: 400 });
        }

        await connection.query(
            'UPDATE cartItems SET quantity = ? WHERE userId = ? AND productId = ? AND size = ?',
            [quantity, userId, productId, size]
        );
        return NextResponse.json({ message: 'Cart item updated successfully' }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: 'Error updating cart item', error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    console.log("Delete all wishlists items API triggered");
    try {
        const { userId, productId, size } = await req.json(); 

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        await connection.query('DELETE FROM cartItems WHERE userId = ? AND productId = ? AND size = ?', [userId, productId, size]);
        return NextResponse.json({ message: 'All wishlists items deleted successfully' }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: 'Error deleting wishlists items', error: error.message }, { status: 500 });
    }
}

// export async function DELETE_ONE(req: NextRequest) {
//     console.log("Delete one wishlists item API triggered");
//     try {
//         const { userId, productId, size } = await req.json();

//         if (!userId || !productId || !size) {
//             return NextResponse.json({ message: 'User ID, Product ID, and Size are required' }, { status: 400 });
//         }

//         await connection.query(
//             'DELETE FROM cartItems WHERE userId = ? AND productId = ? AND size = ?',
//             [userId, productId, size]
//         );
//         return NextResponse.json({ message: 'Cart item deleted successfully' }, { status: 200 });

//     } catch (error: any) {
//         return NextResponse.json({ message: 'Error deleting cart item', error: error.message }, { status: 500 });
//     }
// }