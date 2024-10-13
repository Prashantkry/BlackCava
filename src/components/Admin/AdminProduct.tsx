'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ConfirmationModal from '../ConfirmationModal';
import { Coffee } from '@/app/Modals/modal';
import { coffeeData } from '@/assets/dummyData';
const API_URL = "http://localhost:3000/api/products/getProducts";

const AdminProductTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

    const [products, setProducts] = useState<Coffee[]>([]);

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
          fetchProducts();
    }, [])

    const handleDelete = (productId: string) => {
        setSelectedProduct(productId);
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        console.log('Deleting product with id:', selectedProduct);
        const remainingProducts=products?.filter(product => product.productId !== selectedProduct);
        if(remainingProducts){
            setProducts(remainingProducts);
        }
        setIsModalOpen(false);
    };

    const cancelDelete = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold">All Products</h1>
                <Link href="/Admin?section=AddNewProduct">
                    <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                        Add New Product
                    </button>
                </Link>
            </div>

            <table className="min-w-full table-auto">
                <thead>
                    <tr>
                        <th className="p-2 border-b">Sr. No.</th>
                        <th className="p-2 border-b">Name</th>
                        <th className="p-2 border-b">Category</th>
                        <th className="p-2 border-b" colSpan={3}>Prices</th>
                        <th className="p-2 border-b">Edit</th>
                        <th className="p-2 border-b">Delete</th>
                    </tr>
                    <tr>
                        <th colSpan={3} />
                        <th>Small</th>
                        <th>Medium</th>
                        <th>Large</th>
                        <th colSpan={2} />
                    </tr>
                </thead>
                <tbody>
                    {products.length && products.map((product, index) => (
                        <tr key={product.productId} className="border-b">
                            <td className="py-2 px-4">{index + 1}</td>
                            <td className="py-2 px-4">{product.name}</td>
                            <td className="py-2 px-4">{product.category}</td>
                            <td className="py-2 px-4">{product.small}</td>
                            <td className="py-2 px-4">{product.medium}</td>
                            <td className="py-2 px-4">{product.large}</td>
                            <td className="py-2 px-4">
                                <button className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600">
                                    Edit
                                </button>
                            </td>
                            <td className="py-2 px-4">
                                <button
                                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                    onClick={() => handleDelete(product.productId)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for delete confirmation */}
            <ConfirmationModal
                isOpen={isModalOpen}
                title="Delete Product"
                message="Are you sure you want to delete this product?"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
};

export default AdminProductTable;

