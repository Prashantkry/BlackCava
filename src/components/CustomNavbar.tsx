"use client";
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation'; // Correct hook for Next.js
import { coffee0 } from '@/assets/Media';
import Image from 'next/image';
import Link from 'next/link';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/Redux/store';

const CustomNavbar = () => {
    const wishlist = useSelector((state: RootState) => state.wishlist.wishlist);
    const cart = useSelector((state: RootState) => state.cart.cart);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        const handleStorageChange = () => {
          const token = localStorage.getItem('customerEmail');
          token ? setIsAuthenticated(true) : setIsAuthenticated(false);
        };
        handleStorageChange(); 
        window.addEventListener('storage', handleStorageChange);
        return () => {
          window.removeEventListener('storage', handleStorageChange);
        };
      }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const isActive = (path: string) => pathname === path;
    const handleNavigation = (path: string) => {
        if (isAuthenticated) {
            router.push(path);
        } else {
            router.push('/Auth'); 
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('customerEmail');
        setIsAuthenticated(false);
        router.push('/');
    };

    return (
        <nav className="bg-black text-gray-200 shadow-lg font-bold">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/">
                        <Image src={coffee0} alt="logo" width={50} height={50} />
                    </Link>

                    {/* Main Menu Links for larger screens */}
                    <div className="hidden md:flex space-x-8">
                        <Link href="/" className={`relative transition duration-300 ${isActive('/') ? 'text-indigo-500' : 'hover:text-indigo-400 group'}`}>
                            Home
                            {isActive('/') && <span className="absolute left-0 bottom-0 w-full h-[2px] bg-indigo-500"></span>}
                        </Link>
                        <Link href="/ProductsPage" className={`relative transition duration-300 ${isActive('/ProductsPage') ? 'text-indigo-500' : 'hover:text-indigo-400 group'}`}>
                            Products
                            {isActive('/ProductsPage') && <span className="absolute left-0 bottom-0 w-full h-[2px] bg-indigo-500"></span>}
                        </Link>
                        <span onClick={() => handleNavigation('/Profile')} className={`relative transition duration-300 ${isActive('/Profile') ? 'text-indigo-500' : 'hover:text-indigo-400 group'}`}>
                            Profile
                            {isActive('/Profile') && <span className="absolute left-0 bottom-0 w-full h-[2px] bg-indigo-500"></span>}
                        </span>
                        <Link href="/AboutPage" className={`relative transition duration-300 ${isActive('/AboutPage') ? 'text-indigo-500' : 'hover:text-indigo-400 group'}`}>
                            About
                            {isActive('/AboutPage') && <span className="absolute left-0 bottom-0 w-full h-[2px] bg-indigo-500"></span>}
                        </Link>
                        {isAuthenticated && (<span className={`relative transition duration-300 ${isActive('/Auth') ? 'text-indigo-500' : 'hover:text-indigo-400 group'}`}onClick={handleLogout} >
                            Logout
                            {isActive('/Auth') && <span className="absolute left-0 bottom-0 w-full h-[2px] bg-indigo-500"></span>}
                        </span>)}
                        {!isAuthenticated && (<Link href="/Auth" className={`relative transition duration-300 ${isActive('/Auth') ? 'text-indigo-500' : 'hover:text-indigo-400 group'}`}>
                            SignIn
                            {isActive('/Auth') && <span className="absolute left-0 bottom-0 w-full h-[2px] bg-indigo-500"></span>}
                        </Link>)}

                        <Link href="/ContactPage" className={`relative transition duration-300 ${isActive('/ContactPage') ? 'text-indigo-500' : 'hover:text-indigo-400 group'}`}>
                            Contact
                            {isActive('/ContactPage') && <span className="absolute left-0 bottom-0 w-full h-[2px] bg-indigo-500"></span>}
                        </Link>
                    </div>

                    {/* Cart and Favorite Icons */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="/CartPage" onClick={() => handleNavigation('/CartPage')} className="relative hover:text-indigo-400 transition duration-300 group">
                            <FaShoppingCart size={24} />
                            {cart.length > 0 && (
                                <span className="absolute top-[-8px] right-[-16px] bg-red-600 text-white text-xs rounded-full px-2 py-0">
                                    {cart.length}
                                </span>
                            )}
                        </Link>
                        <Link href="/FavoritePage" className="relative hover:text-indigo-400 transition duration-300 group">
                            <FaHeart size={24} />
                            {wishlist.length > 0 && (
                                <span className="absolute top-[-8px] right-[-16px] bg-red-600 text-white text-xs rounded-full px-2 py-0">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button className="outline-none focus:outline-none" onClick={toggleMenu}>
                            <svg className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="space-y-2 px-2 pt-2 pb-3 sm:px-3">
                        <Link href="/" className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white ${isActive('/') ? 'bg-gray-800 text-white' : ''}`}>
                            Home
                        </Link>
                        <Link href="/ProductsPage" onClick={() => handleNavigation('/ProductsPage')} className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white ${isActive('/ProductsPage') ? 'bg-gray-800 text-white' : ''}`}>
                            Products
                        </Link>
                        <Link href="/Profile" className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white ${isActive('/Profile') ? 'bg-gray-800 text-white' : ''}`}>
                            Profile
                        </Link>
                        <Link href="/AboutPage" className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white ${isActive('/AboutPage') ? 'bg-gray-800 text-white' : ''}`}>
                            About
                        </Link>
                        {!isAuthenticated && <Link href="/Auth" className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white ${isActive('/Auth') ? 'bg-gray-800 text-white' : ''}`}>
                            SignIn
                        </Link>}
                        <Link href="/ContactPage" className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white ${isActive('/ContactPage') ? 'bg-gray-800 text-white' : ''}`}>
                            Contact
                        </Link>
                        <Link href="/cart" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white">
                            Cart
                        </Link>
                        <Link href="/favorites" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white">
                            Favorites
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default CustomNavbar;
