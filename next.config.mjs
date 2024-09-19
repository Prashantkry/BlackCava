// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     images: {
//         remotePatterns: [{
//             protocol: 'https',
//             hostname: 's3.us-east-2.amazonaws.com',
//             port: '',
//             pathname: '/assets/**'
//         }]
//     },
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 's3.us-east-2.amazonaws.com',
                port: '',
                pathname: '/assets/**',
            },
            {
                protocol: 'https',
                hostname: 'assets.aceternity.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
                port: '',
                pathname: '/photos/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.pixabay.com',
                port: '',
                pathname: '/photo/**',
            },
            {
                protocol: 'https',
                hostname: 'iili.io', // Added hostname for the new image source
                port: '',
                pathname: '/**', // Adjust pathname if needed to match the URL pattern
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com', // Added hostname for Unsplash images
                port: '',
                pathname: '/**', // Adjust pathname if needed to match the URL pattern
              },
            {
                protocol: 'https',
                hostname: 'fakestoreapi.com',
                port: '',
                pathname: '/img/**',
            },
        ],
    },
};

export default nextConfig;
