// src/components/TestimonialCarousel.tsx
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';
import { useState } from 'react';
import { Testimonial } from '@/app/Modals/modal';
import userDummyImage from '@/assets/userDummyImage.webp'


interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative">
      <div className="flex justify-center gap-4 items-center">
        <button onClick={prevSlide}>
          <FaArrowLeft />
        </button>
        <div className="p-4 w-full flex flex-col justify-center items-center gap-6 bg-gray-800 rounded-lg shadow-md sm:w-9/12 md:w-1/2">
          <div className="flex gap-2">
            {Array.from({ length: 5 }, (_, index) => (
              <FaStar
                key={index}
                className={`h-8 w-8 ${index <= testimonials[currentIndex].rating ? 'text-yellow-500' : 'text-gray-400'}`}
              />
            ))}
          </div>
          <p className='text-xl text-center'>{testimonials[currentIndex].review}</p>
          <div className="flex gap-4 items-center justify-center">
            <Image src={userDummyImage} alt={testimonials[currentIndex].username} className='rounded-full w-[10%]'/>
            <p className="font-bold">{testimonials[currentIndex].username}</p>
          </div>
        </div>
        <button onClick={nextSlide}>
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
