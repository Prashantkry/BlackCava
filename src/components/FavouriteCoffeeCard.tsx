import Image from "next/image";
// import coffeeDummyImage from "../assets/coffeeDummyImage.webp";
import { FaShoppingCart, FaEllipsisH } from "react-icons/fa";
import { toggleWishlist } from "../app/Redux/wishlistSlice";
import { Coffee } from "../app/Models/interface";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "@/app/Redux/cartSlice";
import { useState, useRef, useEffect } from "react";
import { RootState } from "@/app/Redux/store";
import { toast } from "react-toastify";
import Link from "next/link";

interface FavoriteCoffeeCardProps {
  coffee: Coffee;
}

const FavoriteCoffeeCard: React.FC<FavoriteCoffeeCardProps> = ({ coffee }) => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>("medium");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const cart = useSelector((state: RootState) => state.cart.cart);
  const [quantity, setQuantity] = useState<number>(1);
  const [showQuantityInput, setShowQuantityInput] = useState<boolean>(false);
  const cartItem = cart.find(
    (item) => item.productId === coffee.productId && item.size === selectedSize
  );

  // const customerEmail = localStorage.getItem("customerEmail")!;
  let customerEmail: string | null = null;
  if (typeof window !== 'undefined') {
    customerEmail = localStorage.getItem("customerEmail");
  }


  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
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
    const newCartItem = cart.find(
      (item) => item.productId === coffee.productId && item.size === size
    );
    if (newCartItem) {
      setQuantity(newCartItem.quantity);
    } else {
      setQuantity(1);
    }
  };

  const handleRemoveFromWishlist = () => {
    dispatch(toggleWishlist(coffee.productId));
    toast.success(`${coffee.name} removed from wishlist`, { autoClose: 1500 });
  };

  const handleAddToCart = async () => {
    if (quantity === 0) {
      // const removeResponse = await fetch('http://localhost:3000/api/products/cartItem/delete', {
      const removeResponse = await fetch('/api/products/cartItem/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerEmail, productId: coffee.productId, size: selectedSize }),
      });

      if (removeResponse.ok) {
        if (customerEmail) {
          dispatch(removeFromCart({ customerEmail, productId: coffee.productId, size: selectedSize, quantity: 0 }));
        } else {
          console.error("Customer email is null");
        }
        toast.success(`${coffee.name} with size ${selectedSize} removed from cart`, { autoClose: 1500 });
      }
    } else {
      const index = cart.findIndex(item => item.productId == coffee.productId && item.size == selectedSize);
      if (index != -1) {
        console.log("frontend update api call");
        // const updateResponse = await fetch('http://localhost:3000/api/products/cartItem', {
        const updateResponse = await fetch('/api/products/cartItem', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ customerEmail, productId: coffee.productId, size: selectedSize, quantity }),
        });

        if (updateResponse.ok) {
          toast.success(`${coffee.name} updated in the cart with size ${selectedSize} and quantity ${quantity}`, { autoClose: 1500 });
        }
      }
      else {
        // const addC = await fetch('http://localhost:3000/api/products/cartItem', {
        const addC = await fetch('/api/products/cartItem', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ customerEmail: customerEmail, productId: coffee.productId, size: selectedSize, quantity: quantity }),
        });
        const data = await addC.json();
        // console.log("data => ", data);
      }
      if (customerEmail) {
        dispatch(addToCart({ customerEmail: customerEmail, productId: coffee.productId, size: selectedSize, quantity: quantity }));
      } else {
        console.error("Customer email is null");
      }
      toast.success(`${coffee.name} added to cart with size ${selectedSize} and quantity ${quantity}`, { autoClose: 1500 });
    }
  };

  return (
    <div
      className="flex flex-col relative sm:flex-row bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 w-full h-60 sm:h-72"
      ref={cardRef}
    >
      <div className="relative w-full sm:w-1/3 h-full">
        <Image
          src={coffee.image}
          alt={coffee.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="flex flex-col gap-3 p-4 w-full sm:w-2/3">
        <div>
          <Link href={`/ProductDetails/${coffee.productId}`}>
            <h2 className="text-xl font-bold text-yellow-500">{coffee.name}</h2>
          </Link>
          <p className="text-sm text-gray-300 mt-1">{coffee.description}</p>
        </div>
        <div>
          <span className="text-yellow-500 font-bold">
            Price: $
            {coffee.sizes[selectedSize]}
          </span>
          <div className="flex justify-between items-center mt-2 w-full gap-2">
            <div className="flex space-x-2">
              <button
                className={`w-10 h-8 flex items-center justify-center px-2 py-1 rounded ${selectedSize === 'small' ? "bg-yellow-600" : "bg-gray-600"
                  }`}
                onClick={() => handleSizeChange('small')}
              >
                S
              </button>
              <button
                className={`w-10 h-8 flex items-center justify-center px-2 py-1 rounded ${selectedSize === 'medium' ? "bg-yellow-600" : "bg-gray-600"
                  }`}
                onClick={() => handleSizeChange('medium')}
              >
                M
              </button>
              <button
                className={`w-10 h-8 flex items-center justify-center px-2 py-1 rounded ${selectedSize === 'large' ? "bg-yellow-600" : "bg-gray-600"
                  }`}
                onClick={() => handleSizeChange('large')}
              >
                L
              </button>
            </div>
            <button
              className="bg-yellow-600 text-gray-900 w-10 h-8 flex items-center justify-center px-3 py-1 rounded-sm"
              onClick={() => setShowQuantityInput(!showQuantityInput)}
            >
              <FaShoppingCart size={20} title="Add to Cart" />
            </button>
          </div>
        </div>
        {showQuantityInput && (
          <div className="flex items-center mt-2">
            <label htmlFor="quantity" className="text-gray-400 mr-2">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              className="w-16 bg-gray-600 text-yellow-500 px-2 py-1 rounded-lg"
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
            <button
              className="ml-4 bg-yellow-500 text-gray-900 px-3 py-1 rounded-lg"
              onClick={handleAddToCart}
            >
              Add
            </button>
          </div>
        )}
      </div>
      <div className="absolute top-2 right-2" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="text-red-200"
        >
          <FaEllipsisH size={20} />
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-1 w-18 bg-gray-700 rounded-lg shadow-lg z-10">
            <button
              onClick={handleRemoveFromWishlist}
              className="block p-2 text-sm text-red-500 hover:bg-gray-600 w-full text-left"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteCoffeeCard;
