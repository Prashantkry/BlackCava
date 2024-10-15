'use client'
import withAuth from '@/utils/withAuth';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaStar } from 'react-icons/fa';
import { toast } from "react-toastify";
const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get('review');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const coffeeRatings = [
    "Disappointing 😞",  // 1 star
    "Bad 😟",            // 2 stars
    "Average 😐",        // 3 stars
    "Good 🙂",           // 4 stars
    "Excellent 😍"
  ];

  useEffect(() => {
    if (search && typeof search === 'string') {
      // validate coffee name is available
    } else {
      router.back();
    }
  }, [search]);

  const handleRatingClick = (index: number) => {
    setRating(index + 1);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim().length < 15) {
      setError('Description must be at least 15 characters long.');
      return;
    }
    if (rating < 1 || rating > 5) {
      setError('Please select a rating between 1 and 5.');
      return;
    }

    const trimmedDescription = description.trim();
    console.log({
      coffee: search,
      description: trimmedDescription,
      rating,
    });

    setError(''); // Clear error after submission
    toast.success('Review Submitted', { autoClose: 1500 });
    router.push(`/ProductsPage`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="p-8 rounded-lg shadow-lg bg-gray-600 max-w-md w-full">
        <h2 className="text-3xl font-semibold text-center mb-4 text-yellow-500">Write a Review</h2>
        <form onSubmit={handleSubmit} onChange={()=>setError('')}>
          {/* Coffee Name Input */}
          <div className="mb-4">
            <label className="block text-white-700 text-xl font-bold mb-2" htmlFor="coffee-name">
              Coffee Name
            </label>
            <input
              type="text"
              id="coffee-name"
              value={search!}
              disabled
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 cursor-not-allowed"
            />
          </div>

          {/* Description Input */}
          <div className="mb-4">
            <label className="block text-white-700 text-xl font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              maxLength={300}
              rows={4}
              placeholder="Describe your experience (min 15 characters)..."
              className="w-full text-gray-600 px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Rating (Stars) */}
          <div className="mb-6">
            <div className='flex justify-between items-center'>
              <label className="block text-white-700 text-xl font-bold">Rating</label>
              {rating > 0 && (
                <span className="text-yellow-500">{coffeeRatings[rating - 1]}</span>
              )}
            </div>
            <div className="flex gap-2 justify-center items-center">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  size={30}
                  className={`cursor-pointer transition-transform transform ${index < rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  onClick={() => handleRatingClick(index)}
                />
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition-colors"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAuth(page);


// admin page

/*

    

*/