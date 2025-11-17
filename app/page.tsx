import type { Metadata } from "next";
import { Suspense, lazy } from "react";
import Loading from "./components/loading";
import Hero from "./sections/homepage/hero";

// Lazy load heavy components
const About = lazy(() => import("./sections/homepage/about"));
const History = lazy(() => import("./sections/homepage/history"));

export const metadata: Metadata = {
  title: "بوب كاست - مساحة إبداعية جديدة للبوب العربي",
  description:
    "بوب كاست هو امتداد لمشروع ArabiaPop انطلق في 2025، مساحة إبداعية جديدة بروح مختلفة لكن بحرية. يفتح الباب للحوار والتجارب، مع قصص من وراء الكواليس، حلقات بودكاست مع صناع الموسيقى والجمهور، ومقالات تحليلية تغوص في تاريخ البوب العربي من الثمانينات إلى الألفينات وصولاً للعقد الأخير",
  keywords: [
    "بوب كاست",
    "البوب العربي",
    "ArabiaPop",
    "بودكاست عربي",
    "موسيقى عربية",
    "تاريخ البوب العربي",
    "الثمانينات",
    "التسعينات",
    "الألفينات",
    "ثقافة شعبية عربية",
    "فيديو كليب",
    "روتانا",
    "ميلودي",
    "مازيكا",
    "مقالات موسيقية",
    "دوكس موسيقية",
    "لقاءات فنية",
    "كواليس الفن",
  ],
  openGraph: {
    title: "بوب كاست - مساحة إبداعية جديدة للبوب العربي",
    description:
      "امتداد لمشروع ArabiaPop، مساحة إبداعية تفتح الباب للحوار والتجارب. قصص من وراء الكواليس، بودكاست مع صناع الموسيقى، ومقالات تحليلية تغوص في تاريخ البوب العربي من الثمانينات حتى اليوم",
    type: "website",
    url: "https://itspopcast.com",
    siteName: "بوب كاست",
    images: [
      {
        url: "/images/homepage-og.jpg",
        width: 1200,
        height: 630,
        alt: "بوب كاست - تاريخ البوب العربي",
      },
    ],
    locale: "ar_EG",
  },
  twitter: {
    card: "summary_large_image",
    title: "بوب كاست - مساحة إبداعية جديدة للبوب العربي",
    description:
      "امتداد لمشروع ArabiaPop، قصص من وراء الكواليس، بودكاست مع صناع الموسيقى، ومقالات تحليلية عن تاريخ البوب العربي",
    images: ["/images/homepage-twitter.jpg"],
    creator: "@popcast",
  },
  alternates: {
    canonical: "https://itspopcast.com",
  },
  other: {
    "theme-color": "#ffffff",
    "og:site_name": "بوب كاست",
  },
};

export default function Home() {
  return (
    <main>
      <div className="overflow-x-hidden">
        <Hero />
        <Suspense fallback={<Loading />}>
          <About />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <History />
        </Suspense>
      </div>
    </main>
  );
}
