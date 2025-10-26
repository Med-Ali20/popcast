import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { emirates } from "../fonts/emirates";

import SessionProviderWrapper from "./utils/session-provider";
import "./globals.css";

import Header from "./sections/homepage/header";
import Footer from "./sections/homepage/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://itspopcast.com'),
  title: {
    default: 'بوب كاست - مساحة إبداعية جديدة للبوب العربي',
    template: '%s | بوب كاست',
  },
  description: 'بوب كاست هو امتداد لمشروع ArabiaPop، يفتح الباب للحوار والتجارب بروح مختلفة. اكتشف قصص من وراء الكواليس، حلقات بودكاست مع صناع الموسيقى، ومقالات تحليلية تغوص في تاريخ البوب العربي',
  keywords: [
    'بوب كاست',
    'بودكاست عربي',
    'البوب العربي',
    'موسيقى عربية',
    'ArabiaPop',
    'مقالات موسيقية',
    'تاريخ البوب العربي',
    'ثقافة شعبية',
    'فيديو كليب',
    'صناعة الموسيقى'
  ],
  authors: [{ name: 'بوب كاست' }],
  creator: 'بوب كاست',
  publisher: 'بوب كاست',
  
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    url: 'https://itspopcast.com',
    siteName: 'بوب كاست',
    title: 'بوب كاست - مساحة إبداعية جديدة للبوب العربي',
    description: 'امتداد لمشروع ArabiaPop، يفتح الباب للحوار والتجارب بحرية. قصص من وراء الكواليس، بودكاست مع صناع الموسيقى، ومقالات تحليلية عن تاريخ البوب العربي',
    images: [{
      url: '/images/og-default.jpg',
      width: 1200,
      height: 630,
      alt: 'بوب كاست',
    }],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'بوب كاست - مساحة إبداعية جديدة للبوب العربي',
    description: 'امتداد لمشروع ArabiaPop، يفتح الباب للحوار والتجارب بحرية',
    creator: '@popcast', // Replace with your actual Twitter handle
    images: ['/images/twitter-default.jpg'],
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${emirates.variable} bg-beige antialiased`}
      >
        <SessionProviderWrapper>
          <Header />
          {children}
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
