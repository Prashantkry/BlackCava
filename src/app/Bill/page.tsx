'use client';
import { Transaction } from '../Modals/modal';
import { generateBill } from '@/lib/generateBill';
import { useEffect, useState } from 'react';
import { transactionsData } from '@/assets/dummyData';

const Bill = () => {
    const [order, setOrder] = useState<Transaction | null>(null);

    useEffect(() => {
        // Assuming you want to use the first transaction
        if (transactionsData.length > 0) {
            const details = transactionsData[0];
            setOrder(details);
        }
    }, []);

    if (!order) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="p-6 bg-white shadow-md rounded-lg w-4/5 lg:w-1/2">
                    <h2 className="text-2xl font-bold text-center mb-4">No Transaction Found</h2>
                    <p className="text-gray-600">Please check back later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="p-6 bg-white shadow-md rounded-lg w-4/5 lg:w-1/2">
                <h2 className="text-2xl font-bold text-center mb-4">Black Cava - Coffee Shop</h2>
                <p className="text-gray-600 mb-2">Transaction ID: {order.transactionId}</p>
                <p className="text-gray-600 mb-2">Order ID: {order.orderId}</p>
                <p className="text-gray-600 mb-2">Username: {order.username}</p>
                <p className="text-gray-600 mb-4">Date: {order.date}</p>

                <h3 className="text-xl font-semibold mb-2">Order Details</h3>
                <ul className="mb-4">
                    {order.items.map((item, index) => (
                        <li key={index} className="flex justify-between">
                            <span>{item.name} ({item.size})</span>
                            <span>{item.quantity} x ${item.pricePerQuantity.toFixed(2)}</span>
                        </li>
                    ))}
                </ul>

                <p className="font-semibold text-lg mb-4">Total: ${order.totalAmount.toFixed(2)}</p>

                <button
                    onClick={() => generateBill(order)}
                    className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-300"
                >
                    Download Bill
                </button>
            </div>
        </div>
    );
};

export default Bill;
