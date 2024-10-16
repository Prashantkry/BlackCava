'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import useUserDetailsHook from '@/hooks/useUserDetailsHook';
import { SubmitHandler } from 'react-hook-form';
import usePasswordHook from '@/hooks/usePasswordHook';
import { Coffee, cartCoffeeItem } from '../Models/interface';
import { addToCart, CartItem, clearCart } from '../Redux/cartSlice';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton from the library
import 'react-loading-skeleton/dist/skeleton.css';

interface orderCartData {

}

export interface Transaction {
    transactionId: string;
    stripeSessionId: string;
    customerEmail: string;
    username: string;
    cartItems: orderCartData;
    totalAmount: number;
    createdAt: string;
    orderDelivered: boolean;
    isFavorite: boolean;
}

const Profile = () => {
    const { register: registerUser, handleSubmit: handleUserSubmit, formState: { errors: userErrors }, setValue, clearErrors } = useUserDetailsHook();
    const { register: changePassword, handleSubmit: handlePassword, formState: { errors: passwordErrors }, watch } = usePasswordHook();
    const [allTransactions, setAllTransactions] = useState<Transaction[]>();
    const [user, setUser] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangePassword, setIsChangePassword] = useState(false);
    const [photo, setPhoto] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [backendPic, setBackendPic] = useState("")

    const customerEmail = localStorage.getItem("customerEmail")!;

    useEffect(() => {
        const fetchUserDetails = async () => {
            const response = await fetch(`/api/users/oneUser?email=${customerEmail}`);
            const data = await response.json();
            console.log("users data => ", data)
            if (response.ok) {
                setUser(data);
                setValue('name', data.user.name);
                setValue('addressLine1', data.user.addressLine1);
                setValue('city', data.user.city);
                setValue('state', data.user.state);
                setValue('email', data.user.email);
                setValue('pinCode', data.user.pinCode);
                setValue('phoneNumber', data.user.phoneNumber);
                setPhoto(data.user.profilePic);
            }
            setLoading(false)
        };
        fetchUserDetails();
    }, []);

    useEffect(() => {
        if (customerEmail) {
            fetchOrderDetails(customerEmail);
        }
    }, [customerEmail]);

    // ! profile pic change 
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result as string;
                setPhoto(reader.result as string);
                setBackendPic(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const fetchOrderDetails = async (customerId: string) => {
        try {
            const response = await fetch(`/api/getOrders?customerId=${customerId}`);
            const result = await response.json();
            console.log("order data => ", result);

            if (response.ok && result.success) {
                // Parsing the cartItems field
                const ordersWithParsedItems = result.data.map((order: any) => ({
                    ...order,
                    cartItems: JSON.parse(order.cartItems),
                }));

                setAllTransactions(ordersWithParsedItems);
                console.log("ordersWithParsedItems => ", ordersWithParsedItems)
            } else {
                console.error('Failed to fetch orders:', result.message);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        clearErrors();
    };

    // ! update user data
    const onSubmit: SubmitHandler<any> = async (data) => {
        const { name, email, phoneNumber, addressLine1, city, state, pinCode } = data;
        const userData = {
            name,
            email,
            phoneNumber,
            addressLine1,
            city,
            state,
            pinCode,
            profilePic: backendPic,
        }
        try {
            const response = await fetch(`/api/users/oneUser`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userData, customerEmail })
            });

            if (!response.ok) {
                throw new Error('Failed to update user details');
            }

            const result = await response.json();
            console.log("user data after update => ", result)
            toast.success("User details updated successfully");
            setUser({ ...user, ...data });
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            toast.error("Error updating user details");
        }
    };

    // ! reset password 
    const savePassword: SubmitHandler<any> = async (data) => {
        // console.log("save pass => ", data);
        const passD = data;
        try {
            const pass = await fetch(`http://localhost:3000/api/users/oneUser`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ passD: passD.newPassword, customerId: customerEmail })
            });

            const updatedPass = await pass.json();
            // console.log("updatedPass => ", updatedPass);

            if (updatedPass.success) {
                toast.success("Password updated successfully!");
            } else {
                toast.error(updatedPass.message || "Failed to update password");
            }

        } catch (error) {
            console.error("Error updating password:", error);
            toast.error("An error occurred while updating password");
        }
    };


    // ! copy order id to clipboard
    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert('Order ID copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };


    return (
        <div className="min-h-screen bg-gray-900 text-white py-16 px-4">
            <div className="container mx-auto text-tiny md:text-base">
                {/* fetch profile data */}
                <div className="flex flex-col bg-gray-600 p-4 md:pt-6 gap-2 md:gap-4 text-black rounded-lg md: md:flex-row">
                    <div className="flex flex-col items-center justify-items-center gap-2 md:gap-4 md:w-1/3 lg:w-1/4">
                        {
                            loading ? (
                                <Skeleton circle={true} height={128} width={128} />
                            ) : (
                                photo ? (
                                    <Image src={photo} alt="User Photo" width={128} height={128} className="rounded-full" />
                                ) : (
                                    <input
                                        type="text" disabled={!isEditing}
                                        {...registerUser('name')}
                                        className={`border bg-gray-300 p-1 pl-2 md:p-2 rounded-lg ${userErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                )
                            )
                        }
                        <input type="file" onChange={handlePhotoChange} className="hidden" id="photoInput" />
                        <label htmlFor="photoInput" className="cursor-pointer text-yellow-500 font-medium">Change Photo</label>
                        {isChangePassword && !loading &&
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
                                <label htmlFor="name" className='text-yellow-500 font-medium'>Name:</label>
                                {loading ? (
                                    <Skeleton width={200} height={35} />
                                ) : (
                                    <input
                                        type="text" disabled={!isEditing}
                                        {...registerUser('name')}
                                        className={`border bg-gray-300 p-1 pl-2 md:p-2 rounded-lg ${userErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                )}
                                {userErrors.name && <span className="text-red-500">{userErrors.name.message}</span>}
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="email" className='text-yellow-500 font-medium'>Email:</label>
                                {loading ? (
                                    <Skeleton width={200} height={35} />
                                ) : (
                                    <input
                                        type="text" disabled={!isEditing}
                                        {...registerUser('email', { required: 'Required Field', pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, message: 'Email is not valid' } })}
                                        readOnly
                                        className="border p-1 pl-2 md:p-2 bg-gray-300 border-gray-300 rounded-lg "
                                    />
                                )}
                                {userErrors.email && <span className="text-red-500">{userErrors.email.message}</span>}
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="phoneNumber" className='text-yellow-500 font-medium'>Phone Number:</label>
                                <input
                                    type="text" disabled={!isEditing}
                                    {...registerUser('phoneNumber', {
                                        required: 'Required Field', pattern: {
                                            value: /^[789]\d{9}$/,
                                            message: 'Please enter valid number',
                                        },
                                    })}
                                    className={`border p-1 pl-2 md:p-2 bg-gray-300 rounded-lg ${userErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {userErrors.phoneNumber && <span className="text-red-500">{userErrors.phoneNumber.message}</span>}
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="addressLine1" className='text-yellow-500 font-medium'>Address Line 1:</label>
                                <input
                                    type="text" disabled={!isEditing}
                                    {...registerUser('addressLine1')}
                                    className={`border p-1 pl-2 md:p-2 bg-gray-300 rounded-lg ${userErrors.addressLine1 ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {userErrors.addressLine1 && <span className="text-red-500">{userErrors.addressLine1.message}</span>}
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="city" className='text-yellow-500 font-medium'>City:</label>
                                <input
                                    type="text" disabled={!isEditing}
                                    {...registerUser('city')}
                                    className={`border p-1 pl-2 md:p-2 bg-gray-300 rounded-lg ${userErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {userErrors.city && <span className="text-red-500">{userErrors.city.message}</span>}
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="state" className='text-yellow-500 font-medium'>State:</label>
                                <input
                                    type="text" disabled={!isEditing}
                                    {...registerUser('state')}
                                    className={`border p-1 pl-2 md:p-2 bg-gray-300 rounded-lg ${userErrors.state ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {userErrors.state && <span className="text-red-500">{userErrors.state.message}</span>}
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="pinCode" className='text-yellow-500 font-medium'>Pincode:</label>
                                <input
                                    type="text" disabled={!isEditing}
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

                {/* fetch orders data */}
                <div className="p-4 mt-2 md:mt-4 bg-gray-600 rounded-lg text-xs md:text-base">
                    <p className="relative px-4 py-2 text-yellow-500">
                        Orders Details
                        <span className="absolute left-0 bottom-0 h-[2px] bg-indigo-500 transition-all duration-300 ease-in-out w-full" />
                    </p>

                    <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full border-collapse bg-gray-800 text-white">
                            <thead>
                                <tr className="bg-gray-900 text-yellow-500">
                                    <th className="border-b-2 border-gray-700 py-3 text-left px-4">Order ID</th>
                                    <th className="border-b-2 border-gray-700 py-3 text-left px-4">Order Date</th>
                                    <th className="border-b-2 border-gray-700 py-3 text-left px-4">Coffee</th>
                                    <th className="border-b-2 border-gray-700 py-3 text-left px-4">Quantity</th>
                                    <th className="border-b-2 border-gray-700 py-3 text-left px-4">Size</th>
                                    <th className="border-b-2 border-gray-700 py-3 text-left px-4">Total</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-700">
                                {allTransactions && allTransactions.length ? (
                                    allTransactions.map((order: Transaction) => (
                                        <React.Fragment key={order.transactionId}>
                                            <tr className="hover:bg-gray-600 transition-colors text-left duration-200">
                                                <td
                                                    className="border-b border-gray-600 py-2 px-4 max-w-[2vw] overflow-hidden cursor-pointer"
                                                    onClick={() => handleCopyToClipboard(order.stripeSessionId)}
                                                    title="Click to copy Order ID"
                                                >
                                                    {order.stripeSessionId.split('_').slice(0, 4).join('_') + (order.stripeSessionId.split('_').length > 4 ? '...' : '')}
                                                </td>
                                                <td className="border-b border-gray-600 py-2 px-4">
                                                    {new Date(order.createdAt).toLocaleString([], {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: false
                                                    })}
                                                </td>
                                                <td className="border-b border-gray-600 py-2 px-4">
                                                    {order.cartItems && Array.isArray(order.cartItems) ? (
                                                        order.cartItems.map(item => item.name).join(', ')
                                                    ) : (
                                                        ''
                                                    )}
                                                </td>
                                                <td className="border-b border-gray-600 py-2 px-4">
                                                    {order.cartItems && Array.isArray(order.cartItems) ? (
                                                        order.cartItems.map(item => item.quantity).join(', ')
                                                    ) : (
                                                        0
                                                    )}
                                                </td>
                                                <td className="border-b border-gray-600 py-2 px-4">
                                                    {order.cartItems && Array.isArray(order.cartItems) ? (
                                                        order.cartItems.map(item => item.size.charAt(0)).join(', ')
                                                    ) : (
                                                        0
                                                    )}
                                                </td>
                                                <td className="border-b border-gray-600 py-2 px-4">
                                                    &#8377;  {order.cartItems && Array.isArray(order.cartItems) ? (
                                                        order.cartItems.reduce((total: number, item) => total + (item.pricePerQuantity * item.quantity || 0), 0)
                                                    ) : (
                                                        0
                                                    )}
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4 text-yellow-500">
                                            No orders available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Profile;