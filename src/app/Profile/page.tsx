'use client';
import Image from 'next/image';
import { FaHeart } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
import useUserDetailsHook from '@/hooks/useUserDetailsHook';
import { transactionsData, coffeeData } from '@/assets/dummyData';
import { userData } from '@/assets/dummyData';
import { SubmitHandler } from 'react-hook-form';
import userDummyImage from "@/assets/userDummyImage.webp";
import usePasswordHook from '@/hooks/usePasswordHook';
import { Coffee, Transaction, cartCoffeeItem } from '../Modals/modal';
import { addToCart, clearCart } from '../Redux/cartSlice';
import { toast } from 'react-toastify';
import { generateBill } from '@/lib/generateBill';
const Profile = () => {
    const { register: registerUser, handleSubmit: handleUserSubmit, formState: { errors: userErrors }, setValue } = useUserDetailsHook();
    const { register: changePassword, handleSubmit: handlePassword, formState: { errors: passwordErrors }, watch } = usePasswordHook();
    const dispatch = useDispatch();
    const [selectedTab, setSelectedTab] = useState<"Delivered" | "Pending" | "Favorites">("Delivered");
    const [allTransactions, setAllTransactions] = useState<Transaction[]>();
    const [filteredOrders, setFilteredOrders] = useState<Transaction[]>();
    const [openDetails, setOpenDetails] = useState<string | null>(null);
    const [user, setUser] = useState(userData[0]);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangePassword, setIsChangePassword] = useState(false);
    const [photo, setPhoto] = useState(user.profile);
    const [coffeeProducts, setCoffeeProducts] = useState<Coffee[]>([]);


    useEffect(() => {
        setValue('firstName', user.firstName);
        setValue('lastName', user.lastName);
        setValue('addressLine1', user.addressLine1);
        setValue('addressLine2', user.addressLine2);
        setValue('city', user.city);
        setValue('state', user.state);
        setValue('gender', user.gender);
        setValue('email', user.email);
        setValue('pinCode', user.pinCode);
        setValue('middleName', user.middleName);
        setValue('phoneNumber', user.phoneNumber);
        setCoffeeProducts(coffeeData);
        setAllTransactions(transactionsData);
    }, []);

    useEffect(() => {
        filterOrder();
    }, [selectedTab, allTransactions]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const filterOrder = () => {
        let selectedOrders: Transaction[] = [];
        if (allTransactions?.length) {
            if (selectedTab !== "Favorites") {
                selectedOrders = allTransactions.filter((order) =>
                    selectedTab === "Delivered" ? order.orderDelivered : !order.orderDelivered
                );
            } else {
                selectedOrders = allTransactions.filter((order) => order.isFavorite);
            }
        }
        setFilteredOrders(selectedOrders);
    };

    const savePassword: SubmitHandler<any> = (data) => {
        console.log(data);
    }

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const onSubmit: SubmitHandler<any> = (data) => {
        setUser({ ...user, ...data });
        setIsEditing(false);
    };

    const handleToggleDetails = (transactionId: string) => {
        setOpenDetails(openDetails === transactionId ? null : transactionId);
    };

    const handleRepeatOrder = (items: cartCoffeeItem[]) => {
        dispatch(clearCart());
        items.map((item) => {
            const currentProduct = coffeeProducts.find(
                (product) => product.productId === item.productId
            );
            if (currentProduct) {
                const currentSize = currentProduct.sizes.find(
                    (size) => size.size === item.size
                );
                if (currentSize) {
                    dispatch(addToCart({ productId: currentProduct.productId, size: currentSize.size, quantity: item.quantity }));
                }
            }
        });
        toast.success(`items added from this order to cart`, { autoClose: 1500 });
        toast.warning(`items price may have changed from current order price`);
    };

    const setVisibleTab = (tabName: "Delivered" | "Pending" | "Favorites") => {
        if (selectedTab !== tabName) {
            setOpenDetails(null);
            setSelectedTab(tabName);
        }
    }

    const toggleOrderFavorite = (transactionId: string) => {
        const updatedTransactions = allTransactions?.map((order) => {
            if (order.transactionId === transactionId) {
                const isFavorite = !order.isFavorite;
                toast.success(`Order ${isFavorite ? 'added to' : 'removed from'} favorites`, { autoClose: 1500 });
                return { ...order, isFavorite };
            }
            return order;
        });
        setAllTransactions(updatedTransactions);
        filterOrder(); 
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white py-16 px-4">
            <div className="container mx-auto text-tiny md:text-base">
                <div className="flex flex-col bg-gray-600 p-4 md:pt-6 gap-2 md:gap-4 text-black rounded-lg md: md:flex-row">
                    <div className="flex flex-col items-center justify-items-center gap-2 md:gap-4 md:w-1/3 lg:w-1/4">
                        <Image src={photo || userDummyImage} alt="User Photo" className="w-32 h-32 rounded-full" />
                        <input type="file" onChange={handlePhotoChange} className="hidden" id="photoInput" />
                        <label htmlFor="photoInput" className="cursor-pointer text-yellow-500 font-medium">Change Photo</label>
                        {isChangePassword &&
                            <form onSubmit={handlePassword(savePassword)} className='pl-4'>
                                <div className='flex items-center justify-items-center flex-col gap-2 md:gap-4'>
                                    <input type="password" placeholder="New Password"
                                        {...changePassword('newPassword', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 8,
                                                message: 'Password must be at least 8 characters long',
                                            },
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                                message: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
                                            },
                                        })}
                                        className={`border p-1 pl-2 md:p-2 bg-gray-300 rounded-lg ${passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {passwordErrors.newPassword && <span className="text-red-500">{passwordErrors.newPassword.message}</span>}

                                    <input
                                        type="password" placeholder="Confirm Password"
                                        {...changePassword('confirmPassword', {
                                            validate: (value) => value === watch('newPassword') || 'Passwords do not match',
                                        })}
                                        className={`border p-1 pl-2 md:p-2 bg-gray-300 rounded-lg ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {passwordErrors.confirmPassword && <span className="text-red-500">{passwordErrors.confirmPassword.message}</span>}
                                </div>

                                <button type="submit" className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded">
                                    Change Password
                                </button>
                            </form>}
                        {!isChangePassword && <button onClick={() => setIsChangePassword(!isChangePassword)} >Edit Password</button>}
                    </div>
                    <div className="md:w-2/3 lg:w-3/4">
                        <form onSubmit={handleUserSubmit(onSubmit)} className='grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                            <div className="flex flex-col">
                                <label htmlFor="firstName" className='text-yellow-500 font-medium'>First Name:</label>
                                <input
                                    type="text"
                                    {...registerUser('firstName', { required: 'Required Field' })}
                                    className={`border bg-gray-300 p-1 pl-2 md:p-2 rounded-lg ${userErrors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {userErrors.firstName && <span className="text-red-500">{userErrors.firstName.message}</span>}
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="middleName" className='text-yellow-500 font-medium'>Middle Name:</label>
                                <input
                                    type="text"
                                    {...registerUser('middleName')}
                                    className="border p-1 pl-2 md:p-2 bg-gray-300 border-gray-300 rounded-lg"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="lastName" className='text-yellow-500 font-medium'>Last Name:</label>
                                <input
                                    type="text"
                                    {...registerUser('lastName', { required: 'Required Field' })}
                                    className={`border p-1 pl-2 md:p-2 bg-gray-300  rounded-lg ${userErrors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {userErrors.lastName && <span className="text-red-500">{userErrors.lastName.message}</span>}
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="email" className='text-yellow-500 font-medium'>Email:</label>
                                <input
                                    type="text"
                                    {...registerUser('email', { required: 'Required Field', pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, message: 'Email is not valid' } })}
                                    readOnly
                                    className="border p-1 pl-2 md:p-2 bg-gray-300 border-gray-300 rounded-lg bg-gray-200"
                                />
                                {userErrors.email && <span className="text-red-500">{userErrors.email.message}</span>}
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="phoneNumber" className='text-yellow-500 font-medium'>Phone Number:</label>
                                <input
                                    type="text"
                                    {...registerUser('phoneNumber', {
                                        required: 'Required Field', pattern: {
                                            value: /^[789]\d{9}$/, // Regex for Indian phone numbers
                                            message: 'Please enter valid number',
                                        },
                                    })}
                                    className={`border p-1 pl-2 md:p-2 bg-gray-300 rounded-lg ${userErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {userErrors.phoneNumber && <span className="text-red-500">{userErrors.phoneNumber.message}</span>}
                            </div>

                            <div className="flex flex-col">
                                <label className='text-yellow-500 font-medium'>Gender:</label>
                                <div className="flex items-center">
                                    <label className="mr-4">
                                        <input type="radio" value="Male" {...registerUser('gender')} className="mr-1" />
                                        Male
                                    </label>
                                    <label>
                                        <input type="radio" value="Female" {...registerUser('gender')} className="mr-1" />
                                        Female
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="addressLine1" className='text-yellow-500 font-medium'>Address Line 1:</label>
                                <input
                                    type="text"
                                    {...registerUser('addressLine1', { required: 'Required Field' })}
                                    className={`border p-1 pl-2 md:p-2 bg-gray-300 rounded-lg ${userErrors.addressLine1 ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {userErrors.addressLine1 && <span className="text-red-500">{userErrors.addressLine1.message}</span>}
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="addressLine2" className='text-yellow-500 font-medium'>Address Line 2:</label>
                                <input
                                    type="text"
                                    {...registerUser('addressLine2')}
                                    className="border p-1 pl-2 md:p-2 bg-gray-300 rounded-lg border-gray-300"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="city" className='text-yellow-500 font-medium'>City:</label>
                                <input
                                    type="text"
                                    {...registerUser('city', { required: 'Required Field' })}
                                    className={`border p-1 pl-2 md:p-2 bg-gray-300 rounded-lg ${userErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {userErrors.city && <span className="text-red-500">{userErrors.city.message}</span>}
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="state" className='text-yellow-500 font-medium'>State:</label>
                                <input
                                    type="text"
                                    {...registerUser('state', { required: 'Required Field' })}
                                    className={`border p-1 pl-2 md:p-2 bg-gray-300 rounded-lg ${userErrors.state ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {userErrors.state && <span className="text-red-500">{userErrors.state.message}</span>}
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="pinCode" className='text-yellow-500 font-medium'>Pincode:</label>
                                <input
                                    type="text"
                                    {...registerUser('pinCode', {
                                        required: 'Pincode is required', pattern: {
                                            value: /^[1-9][0-9]{5}$/,
                                            message: 'Please enter a valid 6-digit pincode',
                                        },
                                    })}
                                    className={`border p-1 pl-2 md:p-2 bg-gray-300 rounded-lg ${userErrors.pinCode ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {userErrors.pinCode && <span className="text-red-500">{userErrors.pinCode.message}</span>}
                            </div>

                            <div className="flex justify-end gap-x-4 items-center">
                                <button type="button" onClick={handleEditToggle} className={`text-white py-2 px-4 rounded ${isEditing ? 'bg-red-600' : 'bg-yellow-500'}`}>
                                    {isEditing ? 'Cancel' : 'Edit'}

                                </button>
                                {isEditing && (
                                    <button type="submit" className="bg-yellow-500 text-white py-2 px-4 rounded">
                                        Save
                                    </button>
                                )}
                            </div>

                        </form>
                    </div>
                </div>
                <div className="p-4 mt-2 md:mt-4 bg-gray-600 rounded-lg text-xs md:text-base">
                    {/* Tab Links */}
                    <div className="flex space-x-4">
                        <button
                            className={`relative px-4 py-2 ${selectedTab === "Delivered" ? "text-yellow-500" : "text-white"
                                }`}
                            onClick={() => setVisibleTab("Delivered")}
                        >
                            Delivered Orders
                            <span
                                className={`absolute left-0 bottom-0 h-[2px] bg-indigo-500 transition-all duration-300 ease-in-out ${selectedTab === "Delivered" ? "w-full" : "w-0"
                                    }`}
                            />
                        </button>
                        <button
                            className={`relative px-4 py-2 ${selectedTab === "Pending" ? "text-yellow-500" : "text-white"
                                }`}
                            onClick={() => setVisibleTab("Pending")}
                        >
                            Pending Orders
                            <span
                                className={`absolute left-0 bottom-0 h-[2px] bg-indigo-500 transition-all duration-300 ease-in-out ${selectedTab === "Pending" ? "w-full" : "w-0"
                                    }`}
                            />
                        </button>
                        <button
                            className={`relative px-4 py-2 ${selectedTab === "Favorites" ? "text-yellow-500" : "text-white"
                                }`}
                            onClick={() => setVisibleTab("Favorites")}
                        >
                            Favorites Orders
                            <span
                                className={`absolute left-0 bottom-0 h-[2px] bg-indigo-500 transition-all duration-300 ease-in-out ${selectedTab === "Favorites" ? "w-full" : "w-0"
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Order Table */}
                    <div className="mt-4">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-900 text-yellow-500">
                                    <th className="border py-2 text-center">Order ID</th>
                                    <th className="border py-2 text-center">Order Date</th>
                                    <th className="border py-2 text-center">Total</th>
                                    <th className="border py-2 text-center">Repeat</th>
                                    <th className="border py-2 text-center">Details</th>
                                    <th className="border py-2 text-center">Favorite</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders?.length && filteredOrders.map((order) => (
                                    <React.Fragment key={order.transactionId}>
                                        <tr>
                                            <td className="border py-2 text-center">{order.orderId}</td>
                                            <td className="border py-2 text-center">{order.date}</td>
                                            <td className="border py-2 text-center">${order.totalAmount}</td>
                                            <td className="border py-2 text-center">
                                                <button
                                                    className="bg-yellow-500 text-white px-1 md:px-3 py-1 rounded"
                                                    onClick={() => handleRepeatOrder(order.items)}
                                                >
                                                    Repeat
                                                </button>
                                            </td>
                                            <td className="border py-2 text-center">
                                                <button
                                                    className="bg-gray-300 px-3 py-1 rounded"
                                                    onClick={() => handleToggleDetails(order.transactionId)}
                                                >
                                                    {openDetails === order.transactionId ? "▲" : "▼"}
                                                </button>
                                            </td>
                                            <td className="border py-3 flex items-center justify-center">
                                                <button onClick={() => toggleOrderFavorite(order.transactionId)}>
                                                    <FaHeart size={24} fill={order.isFavorite ? 'red' : 'white'} />
                                                </button>
                                            </td>
                                        </tr>

                                        {/* Order Details */}
                                        {openDetails === order.transactionId && (
                                            <>
                                                <tr className='border border-b-0'>
                                                    <td colSpan={6} className="px-2 md:px-4 py-2">
                                                        <div className="text-left">
                                                            <strong>Order Details:</strong>
                                                            <ul className="list-disc pl-5">
                                                                {order.items.map((item, idx) => (
                                                                    <li key={item.productId}>
                                                                        {item.name} - {item.size[0]} | Qty: {item.quantity} | Price: $
                                                                        {item.pricePerQuantity * item.quantity}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className='border border-t-0'>
                                                    <td colSpan={6} className="px-2 md:px-4 py-2">
                                                        <button className='bg-yellow-500 text-white px-1 md:px-3 py-1 rounded' onClick={() => generateBill(order)}>Generate Bill</button>
                                                    </td>
                                                </tr>
                                            </>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Profile;