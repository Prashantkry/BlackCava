"use client";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { Coffee, FAQItem, Testimonial } from "../../Models/interface";
import { removeFromCart, addToCart } from "@/app/Redux/cartSlice";
import { toggleWishlist } from "@/app/Redux/wishlistSlice";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/Redux/store";
import { toast } from "react-toastify";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

// const API_URL = "http://localhost:3000/api/products/getProducts";
const API_URL = "/api/products/getOneProduct";

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [coffee, setCoffee] = useState<Coffee | null>(null);
  const wishlist = useSelector((state: RootState) => state.wishlist.wishlist);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [showQuantityInput, setShowQuantityInput] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isInWishlist = wishlist.some((item) => item === coffee?.productId);

  let customerEmail: string | null = null;
  if (typeof window !== 'undefined') {
    customerEmail = localStorage.getItem("customerEmail");
  }

  const waitFn = async () => {
    if (id) {
      const fetchProducts = async () => {
        try {
          const response = await fetch(`${API_URL}?id=${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          // console.log("Raw response data:", data);

          if ((data.success = true)) {
            setCoffee(data.product);
            setSelectedSize("medium");
          } else {
            console.error("Failed to fetch products:", data.message);
            router.push("/ProductsPage");
          }
        } catch (error) {
          console.error("Error fetching products:", error);
          router.push("/ProductsPage");
        }
        finally {
          setIsLoading(false);
        }
      };
      await fetchProducts();
    }
  }

  useEffect(() => {
    waitFn();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(
      removeFromCart({
        productId: coffee!.productId,
        size: selectedSize,
        quantity: 0,
        customerEmail: customerEmail || "",
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
          customerEmail: customerEmail || "",
        })
      );
      toast.success(
        `${coffee!.name
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
            <div className="flex flex-col h-[60vh] sm:gap-4 md:flex-row gap-8">
              <div className="w-full md:w-1/2">
                <Image
                  src={coffee.image}
                  className="rounded-2xl h-full"
                  alt={coffee.name}
                  width={500}
                  height={300}
                />
              </div>
              <div className="w-full md:w-1/2">
                <h1 className="text-3xl font-bold text-yellow-500">
                  {coffee.name}
                </h1>
                <p className="text-gray-500 mt-2">{coffee.description}</p>
                <p className="text-gray-500 mt-1"><b>Flavour :</b> {coffee.flavour}</p>

                {/* Size and Price */}
                <div className="mt-4">
                  <h3 className="text-lg font-bold">Available Sizes:</h3>
                  <div className="flex gap-2 mt-2">
                    <button
                      className={`px-4 py-2 rounded-md ${selectedSize === "small"
                        ? "bg-yellow-500"
                        : "bg-gray-600"
                        }`}
                      onClick={() => setSelectedSize("small")}
                    >
                      Small - ${coffee.sizes["small"]}
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md ${selectedSize === "medium"
                        ? "bg-yellow-500"
                        : "bg-gray-600"
                        }`}
                      onClick={() => setSelectedSize("medium")}
                    >
                      Medium - ${coffee.sizes["medium"]}
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md ${selectedSize === "large"
                        ? "bg-yellow-500"
                        : "bg-gray-600"
                        }`}
                      onClick={() => setSelectedSize("large")}
                    >
                      Large - ${coffee.sizes["large"]}
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
          </>
        ) : (
          <>
          <SkeletonTheme baseColor="#1f2937" highlightColor="#E5E7EB">
            <div className="flex flex-col h-[60vh] sm:gap-4 md:flex-row gap-8">
              {/* Image Skeleton */}
              <div className="w-full md:w-1/2">
                <Skeleton height={300} width={500} className="rounded-2xl h-full" />
              </div>

              {/* Coffee Details Skeleton */}
              <div className="w-full md:w-1/2">
                <Skeleton height={30} width="80%" />
                <Skeleton height={20} width="100%" className="mt-3" />
                <Skeleton height={20} width="50%" className="mt-2" />

                <div className="mt-4">
                  <Skeleton height={25} width="60%" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton height={40} width={100} />
                    <Skeleton height={40} width={100} />
                    <Skeleton height={40} width={100} />
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Skeleton width={50} height={40} />
                  <Skeleton width={50} height={40} />
                  <Skeleton width={50} height={40} />
                </div>
              </div>
            </div>
          </SkeletonTheme>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;