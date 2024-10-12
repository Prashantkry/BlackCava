// src/components/Sidebar.tsx
import { FaUser, FaQuestionCircle, FaStar, FaMoneyCheckAlt,FaCoffee  } from 'react-icons/fa';
import { MdDashboard } from "react-icons/md";
import Link from 'next/link';

interface SidebarProps {
    isOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsSidebarOpen }) => {
    return (
        <div
            className={`fixed inset-y-0 left-0 transform bg-gray-800 text-white w-64 z-40 transition-transform duration-300 ${isOpen ? 'absolute translate-x-0 pt-12' : 'absolute -translate-x-full pt-0'
                } md:relative md:translate-x-0`}
        >
            <div className="px-5 py-3 text-lg font-bold">Admin Panel</div>
            <nav className="mt-2">
                <ul className='flex flex-col gap-3'>
                    <li className="px-3 hover:bg-gray-700">
                        <Link href="/Admin?section=Dashboard" onClick={() => setIsSidebarOpen(false)}>
                            <div className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">
                                <MdDashboard /> <span>Dashboard</span>
                            </div>
                        </Link>
                    </li>
                    <li className="px-3 hover:bg-gray-700">
                        <Link href="/Admin?section=Users" onClick={() => setIsSidebarOpen(false)}>
                            <div className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">
                                <FaUser /> <span>Users</span>
                            </div>
                        </Link>
                    </li>
                    <li className="px-3 hover:bg-gray-700">
                        <Link href="/Admin?section=Products" onClick={() => setIsSidebarOpen(false)}>
                            <div className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">
                                <FaCoffee /> <span>Products</span>
                            </div>
                        </Link>
                    </li>
                    <li className="px-3 hover:bg-gray-700">
                        <Link href="/Admin?section=Faqs" onClick={() => setIsSidebarOpen(false)}>
                        <div className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">
                        <FaQuestionCircle /> <span>FAQs</span>
                    </div>
                        </Link>
                    </li>
                    <li className="px-3 hover:bg-gray-700">
                        <Link href="/Admin?section=Testimonials" onClick={() => setIsSidebarOpen(false)}>
                        <div className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">
                        <FaStar /> <span>Testimonials</span>
                    </div>
                        </Link>
                    </li>
                    <li className="px-3 hover:bg-gray-700">
                        <Link href="/Admin?section=Transactions" onClick={() => setIsSidebarOpen(false)}>
                        <div className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">
                        <FaMoneyCheckAlt /> <span>Transactions</span>
                    </div>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;

