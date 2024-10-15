"use client";
import withAuth from '@/utils/withAuth';
import { useSelector } from "react-redux";
import Link from "next/link";
import FavoriteCoffeeCard from "../../components/FavouriteCoffeeCard";
import { RootState } from "@/app/Redux/store";
import { Coffee } from "../Modals/modal";
import { useState, useEffect } from "react";
const API_URL = "http://localhost:3000/api/products/getProducts";
const Page = () => {
  const wishlist = useSelector((state: RootState) => state.wishlist.wishlist);
  const [favoriteProducts, setFavoriteProducts] = useState<Coffee[]>([]);
  const [products, setProducts] = useState<Coffee[]>([]);
  useEffect(() => {
    const fetchAndProcessFavorites = async () => {
      // Step 1: Fetch products
      const fetchProducts = async () => {
        try {
          const response = await fetch(API_URL, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          console.log("Raw response data:", data);
  
          if (data.success) {
            setProducts(data.data);
            return data.data;
          } else {
            console.error("Failed to fetch products:", data.message);
            return [];
          }
        } catch (error) {
          console.error("Error fetching products:", error);
          return [];
        }
      };
  
      const products = await fetchProducts();
      const filteredFavorites = products.filter((product: Coffee) =>
        wishlist.includes(product.productId)
      );
      setFavoriteProducts(filteredFavorites);
    };
  
    fetchAndProcessFavorites();
  }, [wishlist]);
  return (
    <div className="min-h-screen bg-gray-900 text-white py-16 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl text-yellow-500 mb-6">Your Favorites</h1>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProducts.length > 0 ? (
            favoriteProducts.map((coffee) => (
              <FavoriteCoffeeCard key={coffee.productId} coffee={coffee} />
            ))
          ) : (
            <p className="text-gray-400">
              <p>No items in your wishlist yet.</p>
              <Link href="/ProductsPage">
                <button className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-yellow-500 text-black font-semibold rounded-full shadow-lg hover:bg-yellow-400 hover:shadow-xl transition-transform transform hover:scale-105 duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-500">
                  Explore Now
                </button>
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(Page);
