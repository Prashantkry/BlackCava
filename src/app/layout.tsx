'use client';
import { Inter } from "next/font/google";
import "./globals.css";
import CustomNavbar from "@/components/CustomNavbar";
import { Provider } from 'react-redux';
import { store } from './Redux/store';
import { metadata } from './metadata';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=boska@400&f[]=panchang@400&f[]=chillax@200,300&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Satisfy&display=swap"
          rel="stylesheet"
        />
        {/* Add your metadata here if needed */}
        <title>{String(metadata.title) ?? ''}</title>
        <meta name="description" content={metadata.description ?? ''} />
      </head>
      <body className={inter.className}>
        <Provider store={store}>
          <CustomNavbar />
          {children}
          <ToastContainer />
        </Provider>
      </body>
    </html>
  );
}

