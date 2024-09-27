"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';

// API URL
const API_URL = 'https://api.sampleapis.com/coffee/hot';

const ProductsPage = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [favorites, setFavorites] = useState<number[]>([]);
    const [cart, setCart] = useState<number[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = selectedCategory === 'All'
        ? products
        : products.filter(product => product.category === selectedCategory);

    const handleAddToFavorites = (productId: number) => {
        setFavorites(prevFavorites => [...prevFavorites, productId]);
    };

    const handleAddToCart = (productId: number) => {
        setCart(prevCart => [...prevCart, productId]);
    };

    return (
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

                {/* Coffee Categories */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {['All', 'Espresso', 'Cappuccino', 'Latte', 'Mocha'].map((category) => (
                        <motion.button
                            key={category}
                            className={`py-2 px-4 md:py-3 md:px-6 rounded-lg text-base md:text-xl font-semibold transition-transform ${selectedCategory === category ? 'bg-yellow-500 text-gray-900 transform scale-110 shadow-lg' : 'bg-gray-700 hover:bg-gray-600'}`}
                            onClick={() => setSelectedCategory(category)}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {category}
                        </motion.button>
                    ))}
                </div>

                {/* Coffee Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
                    {filteredProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl p-4 flex flex-col items-center transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ rotateY: 10, rotateX: 5 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="relative w-full h-48 md:h-56 mb-4 perspective-1000">
                                <motion.div
                                    className="relative w-full h-full"
                                    initial={{ rotateY: 0, rotateX: 0 }}
                                    whileHover={{ rotateY: 15, rotateX: 10 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <Image
                                        src={product.image}
                                        alt={product.title}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-lg"
                                    />
                                </motion.div>
                            </div>
                            <h2 className="text-lg md:text-xl text-left w-full font-semibold mb-2 text-yellow-300">{product.title}</h2>
                            <p className="text-gray-300 text-sm mb-2">{product.description}</p>
                            {/* <p className="text-gray-400 text-xs mb-4">{product.ingredients.join(', ')}</p> */}
                            <div className="flex justify-between items-center w-full mt-auto">
                                {/* fav button  */}
                                <motion.button
                                    className={`bg-red-600 text-white px-3 py-1 rounded-full text-sm md:text-lg font-semibold transition-transform ${favorites.includes(product.id) ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    onClick={() => handleAddToFavorites(product.id)}
                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                    whileTap={{ scale: 0.9 }}
                                    disabled={favorites.includes(product.id)}
                                >
                                    <FaHeart size={16} />
                                </motion.button>
                                
                                {/* cart add */}
                                <motion.button
                                    className={`bg-yellow-600 text-gray-900 px-3 py-1 rounded-full text-sm md:text-lg font-semibold transition-transform ${cart.includes(product.id) ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    onClick={() => handleAddToCart(product.id)}
                                    whileHover={{ scale: 1.2, rotate: -10 }}
                                    whileTap={{ scale: 0.9 }}
                                    disabled={cart.includes(product.id)}
                                >
                                    <FaShoppingCart size={16} />
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
