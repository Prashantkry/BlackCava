// src/components/Transactions.tsx
import React from 'react';
import { Transaction } from '@/app/Modals/modal';
import TransactionTable from './TransactionTable';

const transactions: Transaction[] = [
  {
    transactionId: 'txn-uuid-1',
    orderId: 1,
    username: 'john@example.com',
    userId:'',
    items: [
      { productId: '1', name: 'Espresso', size: 'Medium', quantity: 2, pricePerQuantity: 4 },
      { productId: '2', name: 'Latte', size: 'Small', quantity: 1, pricePerQuantity: 3 },
    ],
    totalAmount: 11,
    date: '2024-10-01',
    orderDelivered: true,
    isFavorite:false,
  },
  // Add more dummy transactions...
];

const Transactions = () => {
  return (
    <div className="p-6 flex-1">
      <h1 className="text-3xl font-bold mb-6">Transactions</h1>
      <TransactionTable transactions={transactions} />
    </div>
  );
};

export default Transactions;
