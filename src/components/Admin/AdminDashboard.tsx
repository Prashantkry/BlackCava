// src/components/Dashboard.tsx
import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-6 flex-1">
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-xl">Total Sales</h2>
          <p className="text-2xl">$23,450</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-xl">Total Users</h2>
          <p className="text-2xl">1,235</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-xl">Active Orders</h2>
          <p className="text-2xl">45</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
