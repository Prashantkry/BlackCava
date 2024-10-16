// src/components/Users.tsx
"use client";
import Image from 'next/image';
import { user } from '@/app/Models/interface'; // Ensure this has the correct type definition for a user
// import userDummyImage from '@/assets/userDummyImage.webp';
import React, { useState, useEffect } from 'react';

const Users = () => {
  const [users, setUsers] = useState<user[]>([]);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users/allUsers");
        const data = await response.json();
        console.log("Raw response user data:", data);
        if (data.success) {
          setUsers(data.users);
        } else {
          console.error("Failed to fetch users:", data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Sr. No.</th>
              <th className="border p-2">Profile</th>
              <th className="border p-2">Full Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Address</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id}>
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2 text-center">
                    <Image
                      src={user.profilePic || ''}
                      alt="Profile"
                      className="rounded-full mx-auto"
                      width={40}
                      height={40}
                    />
                  </td>
                  <td className="border p-2 text-center">{user.name || "no name"}</td>
                  <td className="border p-2 text-center">{user.email}</td>
                  <td className="border p-2 text-center">
                    {user.addressLine1 || user.city || user.state || user.pinCode
                      ? `${user.addressLine1}, ${user.city}, ${user.state} - ${user.pinCode}`
                      : "no address"}
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-4">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
