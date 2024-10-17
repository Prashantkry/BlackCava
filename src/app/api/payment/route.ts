import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const mongoUrl = process.env.NEXT_PUBLIC_MongoDB!;

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string;
const stripe = new Stripe(stripeKey)

interface CartItem {
    productId: string;
    name: string;
    size: string;
    quantity: number;
    pricePerQuantity: number | null;
}
export async function POST(req: NextRequest) {
    console.log("Payment API triggered");

    const { cartItems, customerEmail } = await req.json();
    console.log("cartItems => ", cartItems, "customerEmail => ", customerEmail);

    if (!cartItems || cartItems.length === 0) {
        return NextResponse.json({ error: "Cart items are missing" }, { status: 400 });
    } else if (!customerEmail) {
        return NextResponse.json({ error: "Customer ID is missing" }, { status: 400 });
    }

    const line_items = cartItems.map((product: CartItem) => {
        if (!product.pricePerQuantity) {
            throw new Error(`Product ${product.name} is missing a price.`);
        }

        return {
            price_data: {
                currency: "inr",
                product_data: {
                    name: product.name,
                    description: `Size: ${product.size}`,
                },
                unit_amount: product.pricePerQuantity * 100,
            },
            quantity: product.quantity,
            // metadata: {
            //     productId: product.productId, // Storing productId in metadata
            // },
        };
    });

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        // phone_number_collection: {
        //     enabled: true,
        // },
        // shipping_address_collection: {
        //     allowed_countries: ["US", "IN"],
        // },
        // custom_text: {
        //     shipping_address: {
        //         message: "Please note that we can't guarantee 2-day delivery for PO boxes at this time.",
        //     },
        //     submit: {
        //         message: "We'll email you instructions on how to get started.",
        //     },
        // },
        success_url: "https://black-cava.vercel.app/Success",
        cancel_url: "https://black-cava.vercel.app",
    });

    // * want to save data in database



    // insert this details on mongo db 

    let client: MongoClient;
    try {
        client = await MongoClient.connect(mongoUrl);
        const db = client.db('blackCava');
        const customersCollection = db.collection('customers');

        // Find the customer by their email
        const customer = await customersCollection.findOne({ email: customerEmail });

        if (!customer) {
            await customersCollection.insertOne({
                name: '', 
                email: customerEmail,
                orders: [
                    {
                        cartItems: cartItems,
                        stripeSessionId: session.id,
                        createdAt: new Date(),
                    }
                ],
                created_at: new Date()
            });
            console.log("New customer created and order saved");
        } else {
            await customersCollection.updateOne(
                { email: customerEmail },
                {
                    $set: {
                        orders: [...customer.orders, {
                            cartItems: cartItems,
                            stripeSessionId: session.id,
                            createdAt: new Date(),
                        }]
                    }
                }
            );
            console.log("Order appended to existing customer using $set");
        }
        return NextResponse.json({ id: session.id, session, status: 200, message: "Payment session created successfully" });
    } catch (error) {
        console.error("Error creating payment session:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}




// Handle webhook events from Stripe
// export async function webhookHandler(req: NextRequest) {
//     if (req.method !== "POST") {
//         return NextResponse.json({ error: `Method ${req.method} not allowed` }, { status: 405 });
//     }

//     const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
//     const sig = req.headers.get("stripe-signature");

//     if (!sig || !endpointSecret) {
//         return NextResponse.json({ error: "Missing Stripe signature or secret" }, { status: 400 });
//     }

//     let event: Stripe.Event;

//     try {
//         const rawBody = await req.text(); // Handle raw body for Stripe signature validation
//         event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);

//         console.log("Webhook event received:", event);

//         // Handle the event
//         switch (event.type) {
//             case "payment_intent.succeeded":
//                 const paymentIntent = event.data.object;
//                 console.log("PaymentIntent was successful:", paymentIntent);
//                 break;
//             default:
//                 console.log(`Unhandled event type ${event.type}`);
//         }

//         return NextResponse.json({ message: "Webhook event handled successfully" }, { status: 200 });
//     } catch (err) {
//         console.error(`⚠️ Webhook signature verification failed: ${err}`);
//         return NextResponse.json({ error: `Webhook Error: ${(err as Error).message}` }, { status: 400 });
//     }
// }

// // Export webhook handler to be used as default in this route for webhook events
// export { webhookHandler as default };
