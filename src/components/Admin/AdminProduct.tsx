'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ConfirmationModal from '../ConfirmationModal';
import { Coffee } from '@/app/Models/interface';
// const API_URL = "http://localhost:3000/api/products/getProducts";
const API_URL = "/api/products/getProducts";

const AdminProductTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

    const [products, setProducts] = useState<Coffee[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState<Coffee | null>(null);
    const [message, setMessage] = useState<string | null>(null);

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
                // console.log("Raw response data:", data);

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
    }, []);

    const handleDelete = (productId: string) => {
        setSelectedProduct(productId);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        console.log('Deleting product with id:', selectedProduct);
        // const deleteProduct = await fetch(`http://localhost:3000/api/products/DeleteProduct?id=${selectedProduct}`, {
        const deleteProduct = await fetch(`/api/products/DeleteProduct?id=${selectedProduct}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await deleteProduct.json();
        console.log('Raw response data:', data);
        if (data.success) {
            const remainingProducts = products?.filter(product => product.productId !== selectedProduct);
            if (remainingProducts) {
                setProducts(remainingProducts);
            }
            setIsModalOpen(false);
        }
    };

    const cancelDelete = () => {
        setIsModalOpen(false);
    };

    const handleEdit = (product: Coffee) => {
        setEditProduct(product);
        setIsEditModalOpen(true);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (editProduct) {
            if (['small', 'medium', 'large'].includes(name)) {
                setEditProduct({
                    ...editProduct,
                    sizes: {
                        ...editProduct.sizes,
                        [name]: value,
                    },
                });
            } else {
                setEditProduct({
                    ...editProduct,
                    [name]: value,
                });
            }
        }
    };

    const submitEditProduct = async () => {
        if (!editProduct) return;

        try {
            const response = await fetch('/api/products/updateProduct', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editProduct),
            });

            const data = await response.json();

            if (data.success) {
                const updatedProducts = products.map(product =>
                    product.productId === editProduct.productId ? editProduct : product
                );
                setProducts(updatedProducts);
                setMessage('Product updated successfully');
            } else {
                setMessage(data.message || 'Error updating product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            setMessage('Failed to update product');
        }

        setIsEditModalOpen(false);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="lg:text-xl text-sm font-semibold">All Products</h1>
                <Link href="/Admin?section=AddNewProduct">
                    <button className="bg-blue-500 text-white lg:text-xl text-sm py-2 px-4 rounded hover:bg-blue-600">
                        Add New Product
                    </button>
                </Link>
            </div>

            <div className='overflow-x-auto'>
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
                                <td className="py-2 px-4">&#8377; {product.sizes.small}</td>
                                <td className="py-2 px-4">&#8377; {product.sizes.medium}</td>
                                <td className="py-2 px-4">&#8377; {product.sizes.large}</td>
                                <td className="py-2 px-4">
                                    <button
                                        className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600"
                                        onClick={() => handleEdit(product)}
                                    >
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
            </div>


            {/* Modal for delete confirmation */}
            <ConfirmationModal
                isOpen={isModalOpen}
                title="Delete Product"
                message="Are you sure you want to delete this product?"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />

            {/* Edit Product Modal */}
            {isEditModalOpen && editProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center w-1/3 h-fit m-auto rounded">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={editProduct.name}
                            onChange={handleEditChange}
                            className="mb-2 p-2 border rounded w-full"
                        />
                        <input
                            type="text"
                            name="category"
                            placeholder="Category"
                            value={editProduct.category}
                            onChange={handleEditChange}
                            className="mb-2 p-2 border rounded w-full"
                        />
                        <input
                            type="text"
                            name="flavour"
                            placeholder="Flavour"
                            value={editProduct.flavour}
                            onChange={handleEditChange}
                            className="mb-2 p-2 border rounded w-full"
                        />
                        <input
                            type="number"
                            name="small"
                            placeholder="Small Price"
                            value={editProduct.sizes.small}
                            onChange={handleEditChange}
                            className="mb-2 p-2 border rounded w-full"
                        />
                        <input
                            type="number"
                            name="medium"
                            placeholder="Medium Price"
                            value={editProduct.sizes.medium}
                            onChange={handleEditChange}
                            className="mb-2 p-2 border rounded w-full"
                        />
                        <input
                            type="number"
                            name="large"
                            placeholder="Large Price"
                            value={editProduct.sizes.large}
                            onChange={handleEditChange}
                            className="mb-2 p-2 border rounded w-full"
                        />
                        <button
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                            onClick={submitEditProduct}
                        >
                            Save Changes
                        </button>
                        <button
                            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 ml-4"
                            onClick={() => setIsEditModalOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {message && <p className="text-center text-green-500 mt-4">{message}</p>}
        </div>
    );
};

export default AdminProductTable;
