import React from "react";
import Image from "next/image";
import { coffee1, shop4 } from "@/assets/Media";

// Importing Google Fonts for cursive font
import "@fontsource/raleway";
import "@fontsource/lora"; 

const AboutPage = () => {
  return (
    <div className="bg-black text-white font-raleway">
      
      {/* Our Story Section */}
      <section className="py-20 px-6 sm:px-12 lg:px-24">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="lg:order-2">
            <Image
              src="https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg"
              alt="Our Story"
              width={800}
              height={500}
              className="rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="lg:order-1 text-center lg:text-left">
            <h2 className="text-4xl font-bold text-yellow-400 mb-4 font-lora italic">Our Story</h2>
            <p className="text-sm text-gray-300 mb-10 leading-relaxed">
              BlackCava Coffee was founded by coffee enthusiasts dedicated to sourcing the finest quality beans from around the world. Our passion for coffee drives us to select the best farms, ensure ethical practices, and craft each cup with care and precision.
            </p>
            <button className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-full shadow-lg hover:bg-yellow-400 transform hover:scale-110 transition-transform duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-1 px-6 sm:px-12 lg:px-24 bg-black">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8 font-lora italic">Our Mission</h2>
          <p className="text-sm text-gray-300 mb-10 leading-relaxed max-w-4xl mx-auto">
            Our mission is to deliver exceptional coffee experiences by blending tradition with innovation. We strive to perfect every cup through sustainable sourcing and meticulous roasting, ensuring quality and flavor in every sip.
          </p>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="py-8 px-6 sm:px-12 lg:px-24 relative">
        <div className="absolute inset-0">
          <Image
            src={coffee1}
            alt="Our Vision"
            layout="fill"
            objectFit="cover"
            className="rounded-lg opacity-50"
          />
        </div>
        <div className="relative container mx-auto flex flex-col justify-center items-center text-center py-10 bg-opacity-60 bg-black rounded-lg">
          <h2 className="text-4xl font-bold text-yellow-400 mb-8 font-lora italic">Our Vision</h2>
          <p className="text-sm text-gray-300 leading-relaxed max-w-3xl">
            At BlackCava, we envision a world where coffee transcends its role as a mere beverage to become a cherished experience. Our goal is to bring exceptional coffee from around the globe to your cup, enriched with sustainability and innovation.
          </p>
        </div>
      </section>

      {/* Experience BlackCava Section */}
      <section className="py-16 px-6 sm:px-12 lg:px-24 text-center bg-black">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8 font-lora italic">Experience BlackCava</h2>
          <p className="text-sm text-gray-300 mb-12">
            Explore our premium collection and discover your perfect coffee. Whether you prefer bold espressos or smooth pour-overs, our range is crafted to elevate every coffee moment to an extraordinary experience.
          </p>
          <button className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-full shadow-lg hover:bg-yellow-400 transform hover:scale-110 transition-transform duration-300">
            Discover Our Blends
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
