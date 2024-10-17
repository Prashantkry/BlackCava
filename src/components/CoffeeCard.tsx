"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../app/Redux/wishlistSlice';
import { addToCart, removeFromCart } from '../app/Redux/cartSlice';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
// import coffeeDummyImage from "../assets/coffeeDummyImage.webp";
import { motion } from 'framer-motion';
import { Coffee } from "../app/Models/interface";
import Image from 'next/image';
import { RootState } from '@/app/Redux/store';
import { toast } from "react-toastify";

interface CoffeeCardProps {
  product: Coffee;
}

const CoffeeCard: React.FC<CoffeeCardProps> = ({ product }) => {
  // console.log("CoffeeCard product => ", product)
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.wishlist.wishlist);
  const cart = useSelector((state: RootState) => state.cart.cart);
  const [quantity, setQuantity] = useState<number>(1);
  const [showQuantityInput, setShowQuantityInput] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium');
  const isInWishlist = wishlist.includes(product.productId);
  const cardRef = useRef<HTMLDivElement | null>(null);

  let customerEmail: string | null = null;

  if (typeof window !== 'undefined') {
    customerEmail = localStorage.getItem("customerEmail");
  }


  const cartItem = cart.find((item) => item.productId === product.productId && item.size === selectedSize);
  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        if (cartItem) {
          setQuantity(cartItem.quantity);
        } else {
          setQuantity(1);
        }
        setShowQuantityInput(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cartItem]);

  const handleSizeChange = (size: 'small' | 'medium' | 'large') => {
    setSelectedSize(size);
    const newCartItem = cart.find((item) => item.productId === product.productId && item.size === size);
    if (newCartItem) {
      setQuantity(newCartItem.quantity);
    } else {
      setQuantity(1);
    }
  };

  const handleWishlistToggle = () => {
    dispatch(toggleWishlist(product.productId));
    if (wishlist.includes(product.productId)) {
      toast.success(`${product.name} removed from wishlist`, { autoClose: 1500 });
    } else {
      toast.success(`${product.name} added to wishlist`, { autoClose: 1500 });
    }
  };

  const handleAddToCart = async () => {
    if (quantity === 0) {
      // const removeResponse = await fetch('http://localhost:3000/api/products/cartItem', {
      const removeResponse = await fetch('/api/products/cartItem', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerEmail, productId: product.productId, size: selectedSize }),
      });

      if (removeResponse.ok) {
        dispatch(removeFromCart({ customerEmail: customerEmail || '', productId: product.productId, size: selectedSize, quantity: 0 }));
        toast.success(`${product.name} with size ${selectedSize} removed from cart`, { autoClose: 1500 });
      }
    } else {
      console.log("Product => ", product, "selectedSize => ", selectedSize)
      const index = cart.findIndex(item => item.productId == product.productId && item.size == selectedSize);
      if (index != -1) {
        console.log("frontend update api call");
        // const updateResponse = await fetch('http://localhost:3000/api/products/cartItem', {
        const updateResponse = await fetch('/api/products/cartItem', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ customerEmail, productId: product.productId, size: selectedSize, quantity }),
        });

        if (updateResponse.ok) {
          toast.success(`${product.name} updated in the cart with size ${selectedSize} and quantity ${quantity}`, { autoClose: 1500 });
        }
      }
      else {
        // const addC = await fetch('http://localhost:3000/api/products/cartItem', {
        const addC = await fetch('/api/products/cartItem', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ customerEmail: customerEmail, productId: product.productId, size: selectedSize, quantity: quantity }),
        });
        const data = await addC.json();
        // console.log("data => ", data);
      }
      dispatch(addToCart({ customerEmail: customerEmail || '', productId: product.productId, size: selectedSize, quantity: quantity }));
      toast.success(`${product.name} added to cart with size ${selectedSize} and quantity ${quantity}`, { autoClose: 1500 });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      key={product.productId}
      className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl p-4 flex flex-col items-center"
    >
      <div className="relative w-full h-48 md:h-56 mb-4">
        <Image src={product.image} alt={product.name} className='rounded' fill style={{ objectFit: 'cover' }} />
      </div>
      <Link href={`/ProductDetails/${product.productId}`}>
        <h2 className="text-lg md:text-xl font-semibold mb-2 text-yellow-500">{product.name}</h2>
      </Link>
      <p className="text-gray-300 text-sm mb-2">{product.description}</p>

      <div className="mb-4">
        <span className="text-yellow-500 font-bold">
          Price: &#8377; {product.sizes[selectedSize]!}
        </span>
        <div className="flex mt-2 sm:mb-0">
          <button
            className={`px-2 py-1 mx-1 rounded ${selectedSize === 'small' ? 'bg-yellow-500' : 'bg-gray-600'}`}
            onClick={() => handleSizeChange('small')}
          >
            Small
          </button>
          <button
            className={`px-2 py-1 mx-1 rounded ${selectedSize === 'medium' ? 'bg-yellow-500' : 'bg-gray-600'}`}
            onClick={() => handleSizeChange('medium')}
          >
            Medium
          </button>
          <button
            className={`px-2 py-1 mx-1 rounded ${selectedSize === 'large' ? 'bg-yellow-500' : 'bg-gray-600'}`}
            onClick={() => handleSizeChange('large')}
          >
            Large
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-2 w-full mt-auto">
        <motion.button
          onClick={() => handleWishlistToggle()} title={isInWishlist ? `remove from wishlist` : 'add to wishlist'}
        >
          <FaHeart size={24} fill={isInWishlist ? 'red' : 'white'} />
        </motion.button>
        {/* <FaHeart size={24} onClick={() => handleWishlistToggle()} title={isInWishlist ? `remove from wishlist` : 'add to wishlist'} fill={isInWishlist?'red':'white'}/> */}

        <motion.button
          className="bg-yellow-600 text-gray-900 px-3 py-1 rounded-full"
          onClick={() => setShowQuantityInput(!showQuantityInput)}
          title='add to cart'
        >
          <FaShoppingCart size={16} />
        </motion.button>
        {/* <FaShoppingCart size={24} onClick={() => setShowQuantityInput(!showQuantityInput)}
          title='add to cart' className="decoration-gray-900"/> */}
      </div>

      {showQuantityInput && (
        <div className="flex items-center space-x-4 md:space-x-2">
          <label htmlFor="quantity" className="text-gray-400">Quantity:</label>
          <input
            type="number"
            id="quantity"
            className="w-20 bg-gray-600 text-yellow-500 px-2 py-1 rounded-lg"
            min={0}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
          <button
            className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg sm:px-2 sm:py-1"
            onClick={handleAddToCart}
          >
            Add
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default CoffeeCard;


