import { NextRequest, NextResponse } from 'next/server';
import connection from '@/utils/db';

export async function POST(req: NextRequest): Promise<NextResponse> {
    console.log("Add products API triggered");
    const body = await req.json();
    console.log("Body => ", body);

    const { productId, name, category, flavour, description, image, small, medium, large } = body;

    if (!productId || !name || !category || !flavour || !description || !small || !medium || !large) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    try {
        // Create the products table if it does not exist
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS allProducts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                productId VARCHAR(255) NOT NULL UNIQUE,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(255) NOT NULL,
                flavour VARCHAR(255),
                description TEXT,
                image VARCHAR(255),
                small DECIMAL(10, 2),
                medium DECIMAL(10, 2),
                large DECIMAL(10, 2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Insert the product data into the database
        const [result] = await connection.execute(
            `INSERT INTO allProducts (productId, name, category, flavour, description, image, small, medium,large) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                productId,
                name,
                category,
                flavour,
                description,
                image,
                small, medium, large
            ]
        );

        return NextResponse.json({ message: 'Product added successfully', result }, { status: 200 });

    } catch (error) {
        console.error("Database operation failed:", error);
        return NextResponse.json({
            message: 'Database error',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
