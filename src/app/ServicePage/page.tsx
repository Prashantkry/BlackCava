import React from 'react';

interface BoxComponentProps {
    title: string;
    icon: React.ReactNode;
    bgColor: string;
    hoverColor: string;
}

const page: React.FC = () => {
    return (
        <>
\            <div className='w-full min-h-screen p-6 bg-black text-white'>
                {/* Company Name */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-[#fff] tracking-widest">BlackCava</h1>
                    <p className="text-xl text-gray-400 mt-2">Your Coffee Destination</p>
                </div>

                <div className='max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-6 lg:p-10'>
                    <BoxComponent 
                        title="All Coffee Types" 
                        icon={<CoffeeIcon />} 
                        bgColor="bg-[#FF6F61]" 
                        hoverColor="hover:bg-[#ff5733]" 
                    />
                    <BoxComponent 
                        title="Free Home Delivery" 
                        icon={<DeliveryIcon />} 
                        bgColor="bg-[#6A1B9A]" 
                        hoverColor="hover:bg-[#9c27b0]" 
                    />
                    <BoxComponent 
                        title="All Payment Methods" 
                        icon={<PaymentIcon />} 
                        bgColor="bg-[#388E3C]" 
                        hoverColor="hover:bg-[#4caf50]" 
                    />
                    <BoxComponent 
                        title="Track Orders Soon" 
                        icon={<TrackingIcon />} 
                        bgColor="bg-[#0277BD]" 
                        hoverColor="hover:bg-[#039be5]" 
                    />
                    <BoxComponent 
                        title="Special Event Orders" 
                        icon={<EventIcon />} 
                        bgColor="bg-[#FFA000]" 
                        hoverColor="hover:bg-[#ffb300]" 
                    />
                </div>
            </div>
        </>
    );
};

const BoxComponent: React.FC<BoxComponentProps> = ({ title, icon, bgColor, hoverColor }) => {
    return (
        <div className={`relative group w-full h-60 p-6 ${bgColor} text-center flex flex-col items-center justify-center rounded-xl transition-all duration-300 ${hoverColor} shadow-lg hover:shadow-2xl`}>
            <div className='mb-4'>{icon}</div>
            <h2 className='text-lg font-medium text-gray-300 transition-transform transform duration-300 group-hover:scale-110 group-hover:text-white'>
                {title}
            </h2>
        </div>
    );
};

// Coffee Icon
const CoffeeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-16 h-16 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h8M8 15h8M9 19h6M4 5h16l-1 7H5z" />
    </svg>
);

// Delivery Icon
const DeliveryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-16 h-16 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M9 12v-8m6 8V4" />
    </svg>
);

// Payment Icon
const PaymentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-16 h-16 text-white">
        <rect x="3" y="8" width="18" height="13" rx="2" ry="2"></rect>
        <line x1="1" y1="5" x2="23" y2="5"></line>
    </svg>
);

// Tracking Icon
const TrackingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-16 h-16 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c1.66 0 3-1.34 3-3S13.66 2 12 2 9 3.34 9 5s1.34 3 3 3zM4.21 9.79a1 1 0 011.42 0L12 16.17l6.37-6.38a1 1 0 111.42 1.42l-7.07 7.07a1 1 0 01-1.42 0L4.21 11.21a1 1 0 010-1.42z" />
    </svg>
);

// Event Icon
const EventIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-16 h-16 text-white">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

export default page;
