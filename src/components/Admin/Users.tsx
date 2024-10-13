// src/components/Users.tsx
"use client";
import Image from 'next/image';
import {user} from '@/app/Modals/modal';
import userDummyImage from '@/assets/userDummyImage.webp';
import React, { useState,useEffect } from 'react';

const Users = () => {
  const [users, setUsers] = useState<user[]>([]);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users"); // Replace with your actual API URL
        const data = await response.json();
        if (data.success) {
          setUsers(data.users); // Assuming response has a users array
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
              <th className="border p-2">Gender</th>
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
                      src={user.profile || userDummyImage}
                      alt="Profile"
                      className="h-10 w-10 rounded-full mx-auto"
                    />
                  </td>
                  <td className="border p-2 text-center">{`${user.firstName} ${user.middleName ? user.middleName : ""} ${user.lastName}`}</td>
                  <td className="border p-2 text-center">{user.email}</td>
                  <td className="border p-2 text-center">{user.gender}</td>
                  <td className="border p-2 text-center">
                    {`${user.addressLine1}, ${user.addressLine2 ? user.addressLine2 + ", " : ""}${user.city}, ${user.state} - ${user.pinCode}`}
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
