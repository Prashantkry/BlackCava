import Image from "next/image";
import coffeeDummyImage from "../assets/coffeeDummyImage.webp";
import { useRouter } from "next/navigation";
import { FaEllipsisH } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { RootState } from "@/app/Redux/store";
import { addToCart, removeFromCart } from "@/app/Redux/cartSlice";
import { Coffee, cartCoffeeItem } from "../app/Modals/modal";
import { toast } from "react-toastify";
import Link from "next/link";

interface CartCoffeeCardProps {
  coffee: Coffee;
  item: cartCoffeeItem;
}

const CartCoffeeCard: React.FC<CartCoffeeCardProps> = ({ coffee, item }) => {  
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string>("small");
  const [quantity, setQuantity] = useState<number>(1);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const cart = useSelector((state: RootState) => state.cart.cart);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const cartItem = item;
  const userId=localStorage.getItem("customerId")!;
  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
      setSelectedSize(cartItem.size);
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
        setIsEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cartItem]);

  const handleSizeChange = (size: string) => {
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

  const handleSaveChanges = () => {
    setIsEditing(false);
    dispatch(
      removeFromCart({
        productId: coffee.productId,
        size: selectedSize,
        quantity: 0,
        userId: userId,
      })
    );
    if (quantity === 0) {
      toast.success(
        `${coffee.name} with size ${selectedSize} removed from cart`,
        { autoClose: 1500 }
      );
    } else {
      dispatch(
        addToCart({
          productId: coffee.productId,
          size: selectedSize,
          quantity: quantity,
          userId: userId,
        })
      );
      toast.success(
        `${coffee.name} added to cart with size ${selectedSize} and quantity ${quantity}`,
        { autoClose: 1500 }
      );
    }
  };

  const handleRemoveFromCart = () => {
    dispatch(
      removeFromCart({
        productId: coffee.productId,
        size: selectedSize,
        quantity: 0,
        userId: userId,
      })
    );
    toast.success(
      `${coffee.name} with size ${selectedSize} removed from cart`,
      { autoClose: 1500 }
    );
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleNavigateToProducts = () => {
    router.push(`/ProductsPage?search=${encodeURIComponent(coffee.name)}`);
  };

  return (
    <div
      className="flex flex-col sm:flex-row bg-gray-800 rounded-xl shadow-lg mb-6 w-full h-fit p-4 relative"
      ref={cardRef}
    >
      <div className="relative w-full sm:w-1/3 h-[30vh]">
        <Image
          src={coffee.image || coffeeDummyImage}
          alt={coffee.name}
          className="h-full object-center"
          layout="responsive"
        />
      </div>
      <div className="flex flex-col justify-between w-full sm:w-2/3 p-4 h-[30vh]">
        <div className="flex justify-between items-center">
          <Link href={`/ProductDetails/${coffee.productId}`}>
            <h2 className="text-xl font-bold text-yellow-500">{coffee.name}</h2>
          </Link>
          <div ref={dropdownRef} className="relative">
            <button onClick={handleDropdownToggle}>
              <FaEllipsisH size={20} className="text-yellow-400" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-gray-700 rounded shadow-lg z-10">
                <button
                  onClick={() => setIsEditing(true)}
                  className="block w-full p-2 text-sm text-yellow-500 hover:bg-gray-600"
                >
                  Edit
                </button>
                <button
                  onClick={handleRemoveFromCart}
                  className="block w-full p-2 text-sm text-red-500 hover:bg-gray-600"
                >
                  Remove
                </button>
                <button
                  className="block w-full p-2 text-sm text-green-500 hover:bg-gray-600"
                  onClick={() => handleNavigateToProducts()}
                >
                  Add More
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-300">{coffee.description}</p>
        <div className="">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleSizeChange('small')}
              className={`px-4 py-2 rounded ${
                selectedSize === 'small' ? "bg-yellow-500" : "bg-gray-600"
              } ${isEditing ? "" : "disabled:bg-gray-400"}`}
              disabled={!isEditing && selectedSize !== 'small'}
            >
              S
            </button>
            <button
              onClick={() => handleSizeChange('medium')}
              className={`px-4 py-2 rounded ${
                selectedSize === 'medium' ? "bg-yellow-500" : "bg-gray-600"
              } ${isEditing ? "" : "disabled:bg-gray-400"}`}
              disabled={!isEditing && selectedSize !== 'medium'}
            >
              M
            </button>
            <button
              onClick={() => handleSizeChange('large')}
              className={`px-4 py-2 rounded ${
                selectedSize === 'large' ? "bg-yellow-500" : "bg-gray-600"
              } ${isEditing ? "" : "disabled:bg-gray-400"}`}
              disabled={!isEditing && selectedSize !== 'large'}
            >
              L
            </button>
          </div>
          <div className="flex items-center mt-4">
            <label className="mr-4 text-gray-400">Quantity:</label>
            <input
              type="number"
              className="w-16 px-2 py-1 bg-gray-700 rounded"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              disabled={!isEditing}
            />
            {isEditing && (
              <button
                className="ml-4 bg-yellow-500 text-gray-900 px-3 py-1 rounded-lg"
                onClick={handleSaveChanges}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCoffeeCard;
