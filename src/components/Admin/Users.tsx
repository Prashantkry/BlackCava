// src/components/Users.tsx
import React from 'react';
// import { User } from '../types/User';

const users = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'customer' },
  { id: '2', name: 'Jane Doe', email: 'jane@example.com', role: 'admin' },
  // Add more user data...
];

const Users = () => {
  return (
    <div className="p-6 flex-1">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="bg-gray-100">
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
