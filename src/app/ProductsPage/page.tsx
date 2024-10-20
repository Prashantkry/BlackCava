"use client";
import React, { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation'
import { Coffee } from '../Models/interface';
import CoffeeCard from '@/components/CoffeeCard';
import Loading from '../loading';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// const API_URL = 'https://api.sampleapis.com/coffee/hot';
// const API_URL = 'http://localhost:3000/api/products/getProducts';
const API_URL = '/api/products/getProducts';

const ProductsPage = () => {
    const [products, setProducts] = useState<Coffee[]>([]);
    const searchParams = useSearchParams();
    const search = searchParams.get('search');
    const [filteredProducts, setFilteredProducts] = useState<Coffee[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const itemsPerPage = 12;

    useEffect(() => {
        setIsLoading(true);
        const fetchProducts = async () => {
            try {
                const response = await fetch(API_URL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                console.log('Raw response data:', data);

                if (data.success = true) {
                    setProducts(data.data);
                    setFilteredProducts(data.data);
                } else {
                    console.error('Failed to fetch products:', data.message);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (search && typeof search === 'string') {
            filterByName(search);
        } else {
            setFilteredProducts(products);
        }
    }, [search, products]);

    const filterByCategory = (categoryName: string) => {
        setSelectedCategory(categoryName);
        const filteredData = categoryName === 'All' ? products : products.filter(product => product.category.toLowerCase() === categoryName.toLowerCase());
        setFilteredProducts(filteredData);
        setCurrentPage(1);
    };

    const filterByName = (searchTerm: string) => {
        setSearchQuery(searchTerm);
        const searchWords = searchTerm.split(' ').map(word => word.trim().toLowerCase());
        const filteredData = products.filter(product =>
            searchWords.some(searchWord => product.name.toLowerCase().includes(searchWord) || product.description.toLowerCase().includes(searchWord))
        );
        setFilteredProducts(filteredData);
        setCurrentPage(1);
    };

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    return (
        <Suspense fallback={<Loading />}>
            <div className="min-h-screen bg-gray-900 text-white py-16 px-4">
                <div className="container mx-auto">
                    {/* Page Title */}
                    <motion.h1
                        className="text-3xl md:text-6xl font-extrabold text-center mb-12 text-yellow-400"
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
                    >
                        Welcome to Our Coffee Shop
                    </motion.h1>

                    {/* Search by Coffee Name */}
                    <div className="flex justify-center mb-8">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => filterByName(e.target.value)}
                            placeholder="Search coffee by name..."
                            className="py-2 px-4 w-full max-w-lg rounded-lg text-black"
                        />
                    </div>

                    {/* Coffee Categories */}
                    <div className="flex flex-wrap  justify-center gap-4 mb-12 w-full md:w-fit">
                        {['All', 'Espresso-Based Coffees', 'Milk-Based Coffees', 'Specialty Coffees', 'Cold Coffees'].map((category) => (
                            <motion.button
                                key={category}
                                className={`py-2 px-4 md:py-3 md:px-6 w-full md:w-fit rounded-lg text-base md:text-xl font-semibold transition-transform ${selectedCategory === category ? 'bg-yellow-500 text-gray-900 transform scale-110 shadow-lg' : 'bg-gray-700 hover:bg-gray-600'}`}
                                onClick={() => filterByCategory(category)}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {category}
                            </motion.button>
                        ))}
                    </div>

                    {/* Coffee Products Grid */}
                    {isLoading ? (
                        <SkeletonTheme baseColor="#1f2937" highlightColor="#E5E7EB">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <div key={index} className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl p-4">
                                        <Skeleton height={200} />
                                        <Skeleton height={30} style={{ marginTop: '10px' }} />
                                        <Skeleton height={40} style={{ marginTop: '10px' }} />
                                        <Skeleton height={30} style={{ marginTop: '10px' }} />
                                        <div className="flex gap-2 px-3 mt-2 justify-between">
                                            <Skeleton height={40} width={60}/>
                                            <Skeleton height={40} width={60}/>
                                            <Skeleton height={40} width={60}/>
                                        </div>
                                        <div className="flex gap-2 justify-between">
                                            <Skeleton width={30} height={30} style={{ marginTop: '10px' }} />
                                            <Skeleton width={40} height={30} style={{ marginTop: '10px' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SkeletonTheme>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
                            {currentProducts.map((product) => (
                                <CoffeeCard key={product.productId} product={product} />
                            ))}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-8">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className="bg-gray-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="text-lg">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className="bg-gray-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </Suspense>

    );
};

export default ProductsPage;
