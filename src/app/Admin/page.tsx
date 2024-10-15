"use client";
import React, { useEffect, useState } from 'react';
import Users from '@/components/Admin/Users';
import Transactions from '@/components/Admin/AdminTransactions';
import AdminProductTable from '@/components/Admin/AdminProduct';
import Sidebar from '@/components/Admin/Sidebar';
import { useRouter, useSearchParams } from 'next/navigation';
import Dashboard from '@/components/Admin/AdminDashboard';
import AddNewProduct from '@/components/Admin/AddNewProduct';

const AdminPage:React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const section = searchParams.get('section');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    renderContent();
  }, [router]);

  const renderContent = () => {
    switch (section) {
      case 'Users':
        return <Users />;
      case 'Faqs':
        // return <FAQs />;
      case 'Testimonials':
        // return <Testimonials />;
      case 'Transactions':
        return <Transactions />;
      case 'Products':
        return <AdminProductTable />;
      case 'AddNewProduct':
        return <AddNewProduct />;
      default:
        return <Dashboard />
    }
  };

  return (
    <div className="relative flex h-screen">
      {/* Hamburger Menu for smaller screens */}
      <button
        className="absolute top-3 left-3 z-50 md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M20 20L4 4m16 0L4 20"/></svg>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M20 7H4m16 5H4m16 5H4"/></svg>
          </>
        )}
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main content */}
      <div className={`flex-1 p-5 overflow-auto bg-gray-100 no-scrollbar transition-all duration-300 ${isSidebarOpen ? 'opacity-50' : 'opacity-100'}`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPage;
