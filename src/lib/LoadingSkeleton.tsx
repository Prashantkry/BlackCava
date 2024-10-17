import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse p-5">
      <div className="h-4 bg-gray-300 rounded mb-4"></div>
      <div className="h-4 bg-gray-300 rounded mb-4"></div>
      <div className="h-4 bg-gray-300 rounded mb-4"></div>
    </div>
  );
};

export default LoadingSkeleton;
