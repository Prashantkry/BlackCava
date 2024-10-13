import { NextRequest, NextResponse } from 'next/server';
import connection from '@/utils/db';
import { cartCoffeeItem } from '@/app/Modals/modal';

export async function POST(req: NextRequest) {
    console.log("Add to Cart items API triggered");
    try {
        const items: cartCoffeeItem[] = await req.json();

        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ message: 'Invalid cart item data' }, { status: 400 });
        }

        await connection.query(`
            CREATE TABLE IF NOT EXISTS cartItems (
                id INT AUTO_INCREMENT PRIMARY KEY,
                productId VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                size VARCHAR(50) NOT NULL,
                quantity INT NOT NULL,
                pricePerQuantity DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        const insertPromises = items.map(item => {
            const { productId, name, size, quantity, pricePerQuantity } = item;

            if (!productId || !name || !size || quantity < 1 || pricePerQuantity < 0) {
                throw new Error('Invalid cart item data');
            }

            return connection.query(
                'INSERT INTO cartItems (productId, name, size, quantity, pricePerQuantity) VALUES (?, ?, ?, ?, ?)',
                [productId, name, size, quantity, pricePerQuantity]
            );
        });

        await Promise.all(insertPromises);

        return NextResponse.json({ message: 'Items added to cart successfully' }, { status: 201 });

    } catch (error: any) {
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
