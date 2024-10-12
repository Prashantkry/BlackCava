"use client";
import { useSelector } from 'react-redux';
import QRCode from 'qrcode';
import Link from 'next/link';
import { RootState } from '@/app/Redux/store';
import CartCoffeeCard from '../../components/CartCoffeeCard';
import { Coffee, cartCoffeeItem } from '@/app/Modals/modal';
import { coffeeData } from '@/assets/dummyData';
import { useState, useEffect } from 'react';

const page = () => {
  const cart = useSelector((state: RootState) => state.cart.cart);
  const [cartProducts, setCartProducts] = useState<Coffee[]>([]);
  const [isProccedToBuy, setProccedToBuy] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<cartCoffeeItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const upiId = process.env.NEXT_PUBLIC_UPI_ID;
  const payeeName = process.env.NEXT_PUBLIC_PAYEE_NAME;
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  useEffect(() => {
    const coffeesInCart: Coffee[] = [];
    const coffeesForBill: cartCoffeeItem[] = [];
    cart.forEach(item => {
      const matchingCoffee = coffeeData.find(coffee => coffee.productId === item.productId);
      if (matchingCoffee) {
        const matchingSize = matchingCoffee[item.size];
        coffeesInCart.push(matchingCoffee);
        coffeesForBill.push({
          productId:matchingCoffee.productId,
          name: matchingCoffee.name,
          size: matchingSize,
          quantity: item.quantity,
          pricePerQuantity: matchingCoffee[matchingSize]
        });
      }
    });
    setCartProducts(coffeesInCart);
    setCartItems(coffeesForBill);
    const total = coffeesForBill.reduce((sum, item) => {
      return sum + item.quantity * item.pricePerQuantity;
    }, 0);
    setTotalAmount(total);
  }, [cart]);

  const generateQrCode = async () => {
    const paymentUrl = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${totalAmount}&cu=INR`;
    try {
      const url = await QRCode.toDataURL(paymentUrl,{errorCorrectionLevel:'H',type: 'image/jpeg',});
      setQrCodeUrl(url);
      setProccedToBuy(!isProccedToBuy);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-16 px-4">
      <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 overflow-y-auto max-h-screen no-scrollbar">
          <h1 className="text-2xl font-bold mb-4 text-yellow-500">Your Cart</h1>
          {cart.length > 0 ? (
            <>
              {cartProducts.map((coffee, index) => (
                <CartCoffeeCard key={index} coffee={coffee as Coffee} item={cartItems[index] as cartCoffeeItem} />
              ))}
              <button className="w-full mt-6 px-4 py-2 bg-blue-600 text-gray-200 rounded hover:bg-blue-700">
                Add More Items
              </button>
            </>
          ) : (
            <p className="text-gray-400"><p>Your cart is empty</p>
              <Link href="/ProductsPage">
                <button className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-yellow-500 text-black font-semibold rounded-full shadow-lg hover:bg-yellow-400 hover:shadow-xl transition-transform transform hover:scale-105 duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-500">
                  Explore Now</button>
              </Link>
            </p>
          )}
        </div>
        <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
          <div>
            <h2 className="text-xl font-bold mb-4 text-yellow-500">Bill Summary</h2>
            <div className="grid grid-cols-5 font-bold text-gray-300 mb-2">
              <span>Item</span>
              <span>Size</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>
            {cartItems.map((item, index) => (
              <div className="grid grid-cols-5 text-gray-300 gap-2 mb-4" key={index}>
                <span>{item.name}</span>
                <span>{item.size}</span>
                <span>{item.pricePerQuantity}</span>
                <span>{item.quantity}</span>
                <span>{item.pricePerQuantity * item.quantity}</span>
              </div>
            ))}
            <div className="flex justify-between text-yellow-500 font-bold mt-6">
              <span>Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <button className="w-full mt-6 px-4 py-2 bg-gradient-to-br from-yellow-300 to-yellow-500 text-gray-200 rounded" disabled={isProccedToBuy || totalAmount <= 0} onClick={() => generateQrCode()}>Proceed to Buy</button>
          </div>
          {qrCodeUrl && <div className='mt-4'>
            <img src={qrCodeUrl} alt="UPI QR Code" className='mb-2 mx-auto'/>
            <p className='text-center'>Scan and proceed payment</p>
          
          </div>}

        </div>
      </div>
    </div>
  );
}

export default page