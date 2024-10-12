"use client";
import useAuthHook from '@/hooks/useAuthHook';
import logo from "@/assets/logo.png";
import Image from 'next/image';
import React, { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { register: authRegister, handleSubmit: authSubmit, formState: { errors: authErrors }, watch,reset } = useAuthHook();

    const onSubmit: SubmitHandler<any> = (data) => {
        console.log(data);
    };
    const handleToggle = () => {
        reset();
        setIsLogin(!isLogin);
      };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-900 text-white py-8 px-4">
            <div className="container h-full mx-auto md:text-base">
                <div className="flex h-full w-full justify-center bg-gray-100 rounded-lg">
                    <div className="hidden md:block w-1/2 flex-1 bg-gradient-to-br from-gray-900 to-gray-600 rounded-l-lg p-6">
                        <div className="p-4 border-2 border-yellow-500 border-solid rounded-lg h-full flex flex-1 flex-col gap-2 justify-center items-center">
                            <h1 className="text-2xl lg:text-4xl font-bold text-yellow-500 mb-4">Welcome to BlackCava, Your Coffee Journey Begins Here</h1>
                            <p className='text-base text-white italic'>Discover the perfect blend of tradition and innovation in every sip</p>
                        </div>
                    </div>

                    {/* Right Panel (Form) */}
                    <div className="w-full md:w-1/2 p-6">
                        <div className='relative w-full rounded-lg flex flex-col gap-6 p-4 shadow-md shadow-gray-600 hover:shadow-lg'>
                            <Image src={logo} alt="logo" className="absolute top-2 left-2 h-10 mr-2" width={50} height={50} />
                            <h2 className="text-2xl font-bold text-black text-center">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>

                            <form onSubmit={authSubmit(onSubmit)} className="space-y-6">
                                <div>
                                    {/* <label htmlFor="email" className="block text-sm font-medium text-black font-bold">Email</label> */}
                                    <input
                                        type="email" placeholder='Enter your email'
                                        id="email"
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                        {...authRegister('email', { required: 'Email is required' })}
                                    />
                                    {authErrors.email && <p className="text-red-500 text-sm">{authErrors.email.message}</p>}
                                </div>

                                <div>
                                    {/* <label htmlFor="password" className="block text-sm font-medium text-black font-bold">Password</label> */}
                                    <input
                                        type="password"
                                        id="password" placeholder='Enter your password'
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                        {...authRegister('password', {
                                            required: 'Password is required', minLength: {
                                                value: 8,
                                                message: 'Password must be at least 8 characters long',
                                            },
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                                message: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
                                            },
                                        })}
                                    />
                                    {authErrors.password && <p className="text-red-500 text-sm">{authErrors.password.message}</p>}
                                </div>

                                {isLogin && (
                                    <p className='text-right text-sm -top-4 text-black relative'>
                                        Forgot Your password
                                    </p>
                                )}

                                {!isLogin && (
                                    <div>
                                        {/* <label htmlFor="confirmPassword" className="block text-sm font-medium text-black font-bold">Confirm Password</label> */}
                                        <input
                                            type="password"
                                            id="confirmPassword" placeholder='Confirm Password'
                                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                            {...authRegister('confirmPassword', {
                                                validate: (value) => value === watch('password') || 'Passwords do not match',
                                            })}
                                        />
                                        {authErrors.confirmPassword && <p className="text-red-500 text-sm">{authErrors.confirmPassword.message}</p>}
                                    </div>
                                )}

                                <div>
                                    <button
                                        type="submit"
                                        className={`relative ${isLogin ? '-top-4' : 'top-0'} w-full py-2 px-4 bg-yellow-500 text-black font-bold rounded-lg`}>
                                        {isLogin ? 'Login' : 'Sign Up'}
                                    </button>
                                </div>
                            </form>

                            <div className="text-center">
                                <span className='text-black'>{isLogin ? "Don't have an account?" : "Already have an account?"} </span>
                                <button
                                    onClick={() => handleToggle()}
                                    className="text-yellow-500 text-base md:text-xl">
                                    {isLogin ? 'Sign Up' : 'Login'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default AuthPage;
