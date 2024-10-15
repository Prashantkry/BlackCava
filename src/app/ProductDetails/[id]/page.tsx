"use client";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import coffeeDummyImage from "@/assets/coffeeDummyImage.webp";
import { testimonialData, faqData } from "../../../assets/dummyData";
import { Coffee, FAQItem, Testimonial } from "../../Modals/modal";
import { removeFromCart, addToCart } from "@/app/Redux/cartSlice";
import { toggleWishlist } from "@/app/Redux/wishlistSlice";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/Redux/store";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import FAQ from "@/components/FAQ";
import { toast } from "react-toastify";
const API_URL = "http://localhost:3000/api/products/getProducts";
const ProductDetailsPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [products, setProducts] = useState<Coffee[]>([]);
  const [coffee, setCoffee] = useState<Coffee | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const wishlist = useSelector((state: RootState) => state.wishlist.wishlist);
  const cart = useSelector((state: RootState) => state.cart.cart);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [showQuantityInput, setShowQuantityInput] = useState(false);
  const isInWishlist = wishlist.some((item) => item === coffee?.productId);
  const userId=localStorage.getItem("customerId")!;
  // const cartItem = cart.find((item) => item.productId === coffee?.id && item.size === selectedSize);
  useEffect(() => {
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

        if ((data.success = true)) {
          setProducts(data.data);
        } else {
          console.error("Failed to fetch products:", data.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
    if (id) {
      const foundCoffee = products.find(
        (coffee) => coffee.productId === String(id)
      );
      if (foundCoffee) {
        setCoffee(foundCoffee);
        setSelectedSize("medium");
        const faqItems = faqData.filter(
          (item) => item.coffeeName == foundCoffee.name
        );
        setFaqs(faqItems);
        const testimonialItems = testimonialData.filter(
          (item) => item.coffeeName == foundCoffee.name
        );
        setTestimonials(testimonialItems);
      } else {
        //navigate user to some other page
      }
    }
  }, [id]);

  const handleAddToCart = () => {
    dispatch(
      removeFromCart({
        productId: coffee!.productId,
        size: selectedSize,
        quantity: 0,
        userId:userId,
      })
    );
    if (quantity === 0) {
      toast.success(
        `${coffee!.name} with size ${selectedSize} removed from cart`,
        { autoClose: 1500 }
      );
    } else {
      dispatch(
        addToCart({
          productId: coffee!.productId,
          size: selectedSize,
          quantity: quantity,
          userId: userId,
        })
      );
      toast.success(
        `${
          coffee!.name
        } added to cart with size ${selectedSize} and quantity ${quantity}`,
        { autoClose: 1500 }
      );
    }
    setShowQuantityInput(false);
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlist(coffee!.productId));
  };
  const handleNavigateToProducts = () => {
    router.push(`/ReviewPage?review=${encodeURIComponent(coffee!.name)}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-16 px-4">
      <div className="container mx-auto p-4 flex flex-col gap-12">
        {coffee ? (
          <>
            {/* Coffee Image and Details */}
            <div className="flex flex-col h-[60vh] sm:gap-4 md:flex-row gap-8">
              <div className="w-full md:w-1/2">
                <Image
                  src={coffeeDummyImage}
                  className="rounded-2xl h-full"
                  alt={coffee.name}
                  objectFit="cover"
                />
              </div>
              <div className="w-full md:w-1/2">
                <h1 className="text-3xl font-bold text-yellow-500">
                  {coffee.name}
                </h1>
                <p className="text-gray-600 mt-2">{coffee.description}</p>
                <p className="text-gray-500 mt-1">Flavour: {coffee.flavour}</p>

                {/* Size and Price */}
                <div className="mt-4">
                  <h3 className="text-lg font-bold">Available Sizes:</h3>
                  <div className="flex gap-2 mt-2">
                    <button
                      className={`px-4 py-2 rounded-md ${
                        selectedSize === "small"
                          ? "bg-yellow-500"
                          : "bg-gray-600"
                      }`}
                      onClick={() => setSelectedSize("small")}
                    >
                      Small - ${coffee.small}
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md ${
                        selectedSize === "medium"
                          ? "bg-yellow-500"
                          : "bg-gray-600"
                      }`}
                      onClick={() => setSelectedSize("medium")}
                    >
                      Medium - ${coffee.medium}
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md ${
                        selectedSize === "large"
                          ? "bg-yellow-500"
                          : "bg-gray-600"
                      }`}
                      onClick={() => setSelectedSize("large")}
                    >
                      Large - ${coffee.large}
                    </button>
                  </div>
                </div>

                {/* Add to Cart and Wishlist Buttons */}
                <div className="flex gap-4 mt-6">
                  <button
                    className={`px-4 py-2 rounded-lg bg-yellow-500`}
                    onClick={() => setShowQuantityInput(!showQuantityInput)}
                    title="add to cart"
                  >
                    <FaShoppingCart size={16} />
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg bg-gray-500`}
                    onClick={() => handleToggleWishlist()}
                    title={
                      isInWishlist ? `remove from wishlist` : "add to wishlist"
                    }
                  >
                    {/* {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'} */}
                    <FaHeart size={16} fill={isInWishlist ? "red" : "white"} />
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg bg-blue-500`}
                    onClick={() => handleNavigateToProducts()}
                  >
                    Leave review
                  </button>
                </div>

                {/* Quantity Input */}
                {showQuantityInput && (
                  <div className="flex items-center mt-4">
                    <label className="mr-4 text-gray-400">Quantity:</label>
                    <input
                      type="number"
                      className="w-16 px-2 py-1 bg-gray-700 rounded"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                    />
                    <button
                      onClick={handleAddToCart}
                      className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Confirm
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Testimonial Section */}
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl w-full font-bold text-yellow-500 text-center">
                Customer Testimonials
              </h2>
              <TestimonialCarousel testimonials={testimonials} />
            </div>

            {/* FAQ Section */}
            <div className="flex flex-col gap-4">
              <div className="rounded-xl text-center">
                <h2 className="text-3xl w-full font-bold text-yellow-500 mb-2">
                  Frequently Asked Questions
                </h2>
                <p className="text-sm">
                  Find answers to general questions about our {coffee.name} and
                  services.
                </p>
              </div>
              <FAQ faqs={faqs} />
            </div>
          </>
        ) : (
          <div>Product not found</div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
