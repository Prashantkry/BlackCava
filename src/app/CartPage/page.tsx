"use client";
import withAuth from '@/utils/withAuth';
import { useDispatch, useSelector } from "react-redux";
import QRCode from "qrcode";
import Link from "next/link";
import { RootState } from "@/app/Redux/store";
import CartCoffeeCard from "../../components/CartCoffeeCard";
import { Coffee, cartCoffeeItem } from "@/app/Modals/modal";
import { useState, useEffect } from "react";
import { addToCart, CartItem } from '../Redux/cartSlice';

const API_URL = "http://localhost:3000/api/products/cartItem";
const API_URL_P = "http://localhost:3000/api/products/getProducts";
const API_URL_C = "http://localhost:3000/api/payment";

const Page = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.cart);
  const [products, setProducts] = useState<Coffee[]>([]);
  const [cartProducts, setCartProducts] = useState<Coffee[]>([]);
  const [isProccedToBuy, setProccedToBuy] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<cartCoffeeItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      const fetchProducts = async () => {
        try {
          const response = await fetch(API_URL_P, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          // console.log('Raw response data:', data);

          if (data.success = true) {
            return data.data;
          } else {
            console.error('Failed to fetch products:', data.message);
          }
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };

      const fetchCart = async () => {
        try {
          const response = await fetch(API_URL, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          // console.log("Raw response data:", data);

          if (data.status === 200) {
            // console.log("data success => ", data.status)
            // console.log("cartItems => ", data.cartItems)
            return data.cartItems;
          } else {
            // console.error("Failed to fetch products:", data.message);
            return [];
          }
        } catch (error) {
          console.error("Error fetching products:", error);
          return [];
        }
      };

      const productData = await fetchProducts();
      setProducts(productData);
      const cartData = await fetchCart();
      setCartProducts(cartData);
      // console.log("productData => ", productData, "cartData => ", cartData)

      const coffeesInCart: Coffee[] = [];
      const coffeesForBill: cartCoffeeItem[] = [];

      cartData.forEach((item: CartItem) => {
        const matchingCoffee = productData.find(
          (coffee: Coffee) => coffee.productId === item.productId
        );
        // console.log("matchingCoffee => ", matchingCoffee)
        if (matchingCoffee) {
          if (customerId) {
            dispatch(addToCart({ ...item, userId: customerId }));
          } else {
            console.error("Customer ID is null");
          }
          const matchingSize = item.size as keyof Coffee;
          // console.log("matchingSize => ", matchingSize)
          coffeesInCart.push(matchingCoffee);

          coffeesForBill.push({
            productId: matchingCoffee.productId,
            name: matchingCoffee.name,
            size: matchingSize,
            quantity: item.quantity,
            pricePerQuantity: Number(matchingCoffee[matchingSize.toLowerCase()]),
          });
        }
      });

      setCartProducts(coffeesInCart);
      setCartItems(coffeesForBill);
      const total = coffeesForBill.reduce((sum, item) => {
        return sum + Number(item.quantity) * Number(item.pricePerQuantity);
      }, 0);
      setTotalAmount(total);
    };
    fetchAndProcessData();
  }, []);

  const publicKey =
    "pk_test_51OUipuSD6rEtgA3HR4Yb5I0b10ADtBgl6owKQJmZLFxQiBkdVKPUvGQiJcizlvyXgU3QnsThHOpYDSaEDzWKOsfE00YXM24aQr";
  const customerId = localStorage.getItem("customerId");
  const checkoutPlan = async () => {
    const pay = await fetch(`${API_URL_C}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartItems,
        customerId,
      }),
    });
    const paymentDetails = await pay.json();
    // console.log(paymentDetails);


    const sessionURl = await paymentDetails.session.url;
    // console.log(sessionURl)
    window.location.href = sessionURl
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-16 px-4">
      <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 overflow-y-auto max-h-screen no-scrollbar">
          <h1 className="text-2xl font-bold mb-4 text-yellow-500">Your Cart</h1>
          {/* {cart.length > 0 ? ( */}
          {cartProducts ? (
            <>
              {/* {console.log("cartProducts => ", cartProducts)} */}
              {cartProducts.map((coffee, index) => (
                <>
                  <CartCoffeeCard
                    key={index}
                    coffee={coffee as Coffee}
                    item={cartItems[index] as cartCoffeeItem}
                  />
                </>
              ))}
              <button className="w-full mt-6 px-4 py-2 bg-blue-600 text-gray-200 rounded hover:bg-blue-700">
                Add More Items
              </button>
            </>
          ) : (
            <div className="text-gray-400">
              <p>Your cart is empty</p>
              <Link href="/ProductsPage">
                <button className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-yellow-500 text-black font-semibold rounded-full shadow-lg hover:bg-yellow-400 hover:shadow-xl transition-transform transform hover:scale-105 duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-500">
                  Explore Now
                </button>
              </Link>
            </div>
          )}
        </div>
        {/* Bill section  */}
        <div className="p-4 bg-gray-800 h-fit rounded-lg shadow-lg">
          <div>
            <h2 className="text-xl font-bold mb-4 text-yellow-500">
              Bill Summary
            </h2>
            <div className="grid grid-cols-5 font-bold text-gray-300 mb-2">
              <span>Item</span>
              <span>Size</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>
            {cartItems.map((item, index) => (
              <div
                className="grid grid-cols-5 text-gray-300 gap-2 mb-4"
                key={index}
              >
                <span>{item.name}</span>
                <span>{item.size}</span>
                <span>{item.pricePerQuantity}</span>
                <span>{item.quantity}</span>
                <span>
                  {Number(item.pricePerQuantity) * Number(item.quantity)}
                </span>
              </div>
            ))}
            <div className="flex justify-between text-yellow-500 font-bold mt-6">
              <span>Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <button
              className="w-full mt-6 px-4 py-2 bg-gradient-to-br from-yellow-300 to-yellow-500 text-gray-200 rounded"
              disabled={isProccedToBuy || totalAmount <= 0}
              onClick={checkoutPlan}
            >
              Proceed to Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Page);
