'use client'
import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { useCoffeeForm } from '@/hooks/useCoffeeFormHook'; // Adjust the path
import { Coffee } from '@/app/Modals/modal'; // Adjust the path
import { toast } from 'react-toastify';
import Image from 'next/image';

const AddNewProduct: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { control, handleSubmit, errors, reset, setValue, onSubmit } = useCoffeeForm();

  useEffect(() => {
    setValue("productId", uuidv4())
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String); 
        setValue('image', base64String); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (data: Coffee) => {
    if (!data.image) {
      console.log("image not found")
      toast.warning(`image not found`, { autoClose: 1500 });
      return;
    }

    console.log(data);
    try {
      const response = await fetch('/api/products/AddProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("api data => ", result)
      if (response.ok) {
        toast.success(result.message, { autoClose: 1500 });
        reset();
      } else {
        toast.error('Failed to add product', { autoClose: 1500 });
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Something went wrong', { autoClose: 1500 });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit((data) => onSubmit(data, handleFormSubmit))} className="space-y-6 rounded-lg border-2 border-gray-300 p-4">

        {/* Main form container */}
        <div className="flex w-full flex-row gap-4 items-center justify-between space-y-4 md:space-y-0 md:space-x-6">

          {/* Left side - Image upload */}
          <div className="rounded-md flex flex-col items-center justify-center w-1/2 md:w-1/3 lg:w-1/2">
            {imagePreview ? (
              <Image src={imagePreview} alt="Coffee Image" width={266} height={160} className="rounded-md" />
            ) : (
              <div className="h-40 w-64 bg-gray-200 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Upload Coffee Image</p>
              </div>
            )}
            <label htmlFor="image" className="mt-4 cursor-pointer bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {errors.image && <p className="text-red-500 text-sm lg:text-base mt-2">Image is required</p>}
          </div>

          {/* Right side - Coffee details */}
          <div className="flex flex-col gap-2 w-1/2 md:w-2/3 lg:w-1/2">

            {/* Coffee Name */}
            <Controller
              name="name"
              control={control}
              rules={{
                required: 'Coffee Name is required',
                minLength: {
                  value: 3,
                  message: 'Coffee Name must be at least 3 characters long',
                },
              }}
              render={({ field }) => (
                <input
                  type="text"
                  placeholder="Coffee Name"
                  className="w-full p-2 border rounded-md"
                  {...field}
                />
              )}
            />
            {errors.name && <p className="text-red-500 text-sm lg:text-base">{errors.name.message}</p>}

            {/* Category */}
            <Controller
              name="category"
              control={control}
              rules={{
                required: 'Category is required',
              }}
              render={({ field }) => (
                <input
                  type="text"
                  placeholder="Category"
                  className="w-full p-2 border rounded-md"
                  {...field}
                />
              )}
            />
            {errors.category && <p className="text-red-500 text-sm lg:text-base">{errors.category.message}</p>}

            <Controller
              name="flavour"
              control={control}
              rules={{
                required: 'Flavour is required',
                minLength: {
                  value: 3,
                  message: 'Flavour must be at least 3 characters long',
                },
              }}
              render={({ field }) => (
                <input
                  type="text"
                  placeholder="Flavour"
                  className="w-full p-2 border rounded-md"
                  {...field}
                />
              )}
            />
            {errors.flavour && <p className="text-red-500 text-sm lg:text-base">{errors.flavour.message}</p>}
          </div>
        </div>

        {/* Description */}
        <Controller
          name="description"
          control={control}
          rules={{
            required: 'Description is required',
            minLength: {
              value: 10,
              message: 'Description must be at least 10 characters long',
            },
          }}
          render={({ field }) => (
            <textarea
              placeholder="Description"
              className="w-full p-2 border rounded-md"
              {...field}
            />
          )}
        />
        {errors.description && <p className="text-red-500 text-sm lg:text-base">{errors.description.message}</p>}

        {/* Sizes and Prices */}
        <div className="flex justify-between space-y-4 md:space-y-0 md:space-x-6">
          <Controller
            name='small'
            control={control}
            rules={{
              required: `small Size Price is required`,
              min: {
                value: 0,
                message: `small Size Price must be a positive number`,
              },
            }}
            render={({ field }) => (
              <input
                type="number" min={0}
                placeholder={`small Size Price`}
                className="w-full p-2 border rounded-md"
                value={field.value != null ? field.value : ''}
                onChange={(e) => {
                  field.onChange(e);
                }}
              />
            )}
          />
          <Controller
            name='medium'
            control={control}
            rules={{
              required: `Medium Size Price is required`,
              min: {
                value: 0,
                message: `Medium Size Price must be a positive number`,
              },
            }}
            render={({ field }) => (
              <input
                type="number" min={0}
                placeholder={`medium Size Price`}
                className="w-full p-2 border rounded-md"
                value={field.value !== null ? field.value : ''}
                onChange={(e) => {
                  field.onChange(e);
                }}
              />
            )}
          />
          <Controller
            name='large'
            control={control}
            rules={{
              required: `large Size Price is required`,
              min: {
                value: 0,
                message: `large Size Price must be a positive number`,
              },
            }}
            render={({ field }) => (
              <input
                type="number" min={0}
                placeholder={`large Size Price`}
                className="w-full p-2 border rounded-md"
                value={field.value !== null ? field.value : ''}
                onChange={(e) => {
                  field.onChange(e);
                }}
              />
            )}
          />

          {/* Flavour and Features */}
          <div className="w-full md:w-1/2 space-y-4">

          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
          Add Coffee
        </button>
      </form>
    </div>
  );

};

export default AddNewProduct;

