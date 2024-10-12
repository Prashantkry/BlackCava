// src/components/TransactionTable.tsx
import React from 'react';
import { Transaction } from '@/app/Modals/modal';

interface Props {
  transactions: Transaction[];
}

const TransactionTable: React.FC<Props> = ({ transactions }) => {
  return (
    <table className="w-full table-auto">
      <thead>
        <tr className="bg-gray-200">
          <th className="px-4 py-2">Transaction ID</th>
          <th className="px-4 py-2">Order ID</th>
          <th className="px-4 py-2">Username</th>
          <th className="px-4 py-2">Total Amount</th>
          <th className="px-4 py-2">Date</th>
          <th className="px-4 py-2">Delivered</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction.transactionId} className="bg-gray-100">
            <td className="border px-4 py-2">{transaction.transactionId}</td>
            <td className="border px-4 py-2">{transaction.orderId}</td>
            <td className="border px-4 py-2">{transaction.username}</td>
            <td className="border px-4 py-2">${transaction.totalAmount}</td>
            <td className="border px-4 py-2">{transaction.date}</td>
            <td className="border px-4 py-2">{transaction.orderDelivered ? 'Yes' : 'No'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionTable;
