"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify'; // Import toast
import { login } from '../Redux/userSlice';
import useAuthHook from '@/hooks/useAuthHook';

const AuthPage = () => {
    const dispatch = useDispatch();
    const [isLogin, setIsLogin] = useState(true);
    const { register: authRegister, handleSubmit: authSubmit, formState: { errors: authErrors }, watch, reset,clearErrors } = useAuthHook();
    const navigate = useRouter();
    // const API_URL = isLogin ? "http://localhost:3000/api/signIn" : "http://localhost:3000/api/auth";
    const API_URL = isLogin ? "/api/signIn" : "/api/auth";

    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            console.log("res data => ", result)
            if (result.status === 200) {
                toast.success('Success! You have successfully logged in.', {
                    position: "top-right",
                    autoClose: 5000,
                });
                const customerEmail = await result.email;
                console.log("customer id in signIn => ", customerEmail)
                localStorage.setItem('customerEmail', customerEmail);
                dispatch(login({ userEmail: customerEmail, isAdmin: false, isLogined: true }));
                navigate.push("/")
            }
            else if (result.status === 201) {
                toast.success('Success! You have successfully signed up.', {
                    position: "top-right",
                    autoClose: 5000,
                });
                setIsLogin(true);
            } else {
                toast.error(result.message || 'Error occurred. Please try again.', {
                    position: "top-right",
                    autoClose: 5000,
                });
                console.error('Error:', result.message);
            }
        } catch (error) {
            toast.error('An unexpected error occurred. Please try again.', {
                position: "top-right",
                autoClose: 5000,
            });
            console.error('Error:', error);
        }
    };

    const handleToggle = () => {
        reset();
        clearErrors();
        setIsLogin(!isLogin);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-900 text-white w-full py-8 px-4">
            <div className="h-full lg:mx-[20vw] md:text-base">
                <div className="lg:px-10 py-5 lg:py-5 border-2 border-yellow-500 border-solid rounded-lg h-full flex flex-1 flex-col gap-2 justify-center items-center">
                    <h1 className="text-3xl text-center lg:text-4xl font-bold text-yellow-500 mb-4">Welcome to BlackCava</h1>
                    <h2 className="text-lg font-bold text-center">Your Coffee Journey Begins Here</h2>
                    <form onSubmit={authSubmit(onSubmit)} className="space-y-4 w-full h-full px-2">
                        <div>
                            <input
                                type="email"
                                placeholder='Enter your email'
                                id="email"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 text-black"
                                {...authRegister('email', { required: 'Email is required' })}
                            />
                            {authErrors.email && <p className="text-red-500 text-sm">{authErrors.email.message}</p>}
                        </div>

                        <div>
                            <input
                                type="password"
                                id="password"
                                placeholder='Enter your password'
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 text-black"
                                {...authRegister('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 8,
                                        message: 'Password must be at least 8 characters long',
                                    },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/,
                                        message: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
                                    }
                                })}
                            />
                            {authErrors.password && <p className="text-red-500 text-sm">{authErrors.password.message}</p>}
                        </div>

                        {isLogin && (
                            <p className='text-right text-sm text-white'>
                                Forgot Your password?
                            </p>
                        )}

                        {!isLogin && (
                            <div>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    placeholder='Confirm Password'
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 text-black"
                                    {...authRegister('confirmPassword', {
                                        validate: (value) => value === watch('password') || 'Passwords do not match',
                                    })}
                                />
                                {authErrors.confirmPassword && <p className="text-red-500 text-sm">{authErrors.confirmPassword.message}</p>}
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`relative w-full py-2 px-4 bg-yellow-500 text-gray-700 font-bold rounded-lg`}>
                            {isLogin ? 'Login' : 'Sign Up'}
                        </button>
                        <div className="text-center">
                            <span className='text-gray-500'>{isLogin ? "Don't have an account?" : "Already have an account?"} </span>
                            <button
                                onClick={handleToggle} type="button"
                                className="text-yellow-500 text-base md:text-xl">
                                {isLogin ? 'Sign Up' : 'Login'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
