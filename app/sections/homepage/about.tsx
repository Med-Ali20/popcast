"use client";

import React, { useEffect, useState } from "react";
import Marquee from "../../components/marquee";
import { Slide, Zoom } from "react-awesome-reveal";
import { Headphones, BookOpen } from "lucide-react";

interface Article {
  _id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  thumbnail?: string;
  status: "draft" | "published" | "archived";
  author?: string;
  category?: string;
  slug?: string;
}

interface Podcast {
  _id: string;
  title: string;
  description?: string;
  audioUrl?: string;
  videoUrl?: string;
  youtube?: string;
  spotify?: string;
  anghami?: string;
  appleMusic?: string;
  tags?: string[];
  thumbnailUrl?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
}

interface PodcastCardProps {
  podcast: Podcast;
  onClick: () => void;
}

// Article Card Component
const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  return (
    <div
      dir="rtl"
      onClick={onClick}
      className="relative overflow-x-hidden rounded-lg cursor-pointer group transition-transform duration-300 min-h-[400px] hover:scale-102 bg-[rgba(255,255,255,0.8)] shadow-md hover:shadow-xl w-full max-w-md"
    >
      {/* Thumbnail image if available */}
      {article.thumbnail ? (
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.thumbnail}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
        </div>
      ) : (
        <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <BookOpen className="w-16 h-16 text-white opacity-50" />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Category and Date */}
        <div className="flex justify-between items-center mb-2 text-xs text-gray-500">
          {article.category && (
            <span className="bg-secondary text-primary px-2 py-1 rounded-full">
              {article.category}
            </span>
          )}
          {article.date && (
            <span>{new Date(article.date).toLocaleDateString("ar-EG")}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>

        {/* Content preview */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-3">
          {article.content?.replace(/<[^>]*>/g, "").substring(0, 150)}...
        </p>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-secondary text-black px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Author */}
        {article.author && (
          <div className="text-sm text-gray-500">بواسطة: {article.author}</div>
        )}
      </div>
    </div>
  );
};

// Podcast Card Component
const PodcastCard: React.FC<PodcastCardProps> = ({ podcast, onClick }) => {
  return (
    <div
      dir="rtl"
      onClick={onClick}
      className="relative overflow-hidden rounded-lg cursor-pointer min-h-[400px] group transition-transform duration-300 hover:scale-102 bg-[rgba(255,255,255,0.8)] shadow-md hover:shadow-xl w-full max-w-md"
    >
      {/* Thumbnail image if available */}
      {podcast.thumbnailUrl ? (
        <div className="relative h-48 overflow-hidden">
          <img
            src={podcast.thumbnailUrl}
            alt={podcast.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
        </div>
      ) : (
        <div className="relative h-48 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
          <Headphones className="w-16 h-16 text-white opacity-50" />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Category and Date */}
        <div className="flex justify-between items-center mb-2 text-xs text-gray-500">
          {podcast.category && (
            <span className="bg-secondary text-primary px-2 py-1 rounded-full">
              {podcast.category}
            </span>
          )}
          {podcast.createdAt && (
            <span>
              {new Date(podcast.createdAt).toLocaleDateString("ar-EG")}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2 group-hover:text-primary transition-colors">
          {podcast.title}
        </h3>

        {/* Description preview */}
        {podcast.description && (
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-3">
            {podcast.description?.replace(/<[^>]*>/g, "").substring(0, 150)}...
          </p>
        )}

        {/* Tags */}
        {podcast.tags && podcast.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {podcast.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-secondary text-black px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Platform links */}
        <div className="flex gap-2 text-xs">
          {podcast.spotify && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              Spotify
            </span>
          )}
          {podcast.youtube && (
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
              YouTube
            </span>
          )}
          {podcast.appleMusic && (
            <span className="bg-secondary text-gray-800 px-2 py-1 rounded">
              Apple
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const About = () => {
  const [article, setArticle] = useState<Article | null>(null);
  const [podcast, setPodcast] = useState<Podcast | null>(null);

  const fetchArticle = async (
    page: number,
    search: string = ""
  ): Promise<void> => {
    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "1",
        status: "published",
      });

      if (search) {
        params.append("search", search);
      }

      const response = await fetch(`http://3.70.229.133:3001/article?${params}`);
      const data = await response.json();

      setArticle(data.articles[0] || null);
      console.log("articles data:", data);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setArticle(null);
    }
  };

  const fetchPodcast = async (
    page: number,
    search: string = ""
  ): Promise<void> => {
    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "1",
      });

      if (search) {
        params.append("search", search);
      }

      const response = await fetch(`http://3.70.229.133:3001/podcast?${params}`);
      const data = await response.json();

      setPodcast(data.podcasts[0] || null);
      console.log("podcast data:", data.podcasts[0]);
    } catch (error) {
      console.error("Error fetching podcasts:", error);
      setPodcast(null);
    }
  };

  useEffect(() => {
    Promise.all([fetchArticle(1), fetchPodcast(1)]);
  }, []);

  const handleArticleClick = () => {
    if (article?.slug) {
      window.location.href = `/article/${article.slug}`;
    } else if (article?._id) {
      window.location.href = `/article/${article._id}`;
    }
  };

  const handlePodcastClick = () => {
    if (podcast?._id) {
      window.location.href = `/podcast/${podcast._id}`;
    }
  };

  return (
    <section className="text-white gap-15 lg:gap-20 border-t-1 border-[rgba(255,255,255,0.3)] flex flex-col mt-12 px-10 pt-20 pb-15 font-emirates">
      <div className="flex flex-col gap-10 items-center">
        <Zoom triggerOnce className="mr-[2%]">
          <h1
            dir="rtl"
            className="text-2xl md:text-4xl font-bold mb-6 flex items-center"
          >
            ما هو{" "}
            <img
              src="/images/PopCast Horizontal Logo.png"
              alt=""
              className="w-[120px] h-[20px] lg:w-[170px] mt-2 mr-2 lg:h-[30px]"
            />
          </h1>
        </Zoom>
        <div className="flex flex-col lg:flex-row gap-15 lg:gap-10 row lg:pl-[2%] max-w-[80%] justify-center">
          <Slide direction="up" triggerOnce>
            <div className="flex flex-col items-center text-center">
              <img src="/elements/16.png" alt="" className="w-[120px]" />
              <h2 className="my-6 text-xl md:text-3xl font-bold">
                مقالات تحليلية
              </h2>
              <p className="text-lg md:text-xl" dir="rtl">
                قراءات عميقة تربط الماضي بالحاضر و تفكك تحولات الثقافة الشعبية.
              </p>
            </div>
            <div className="flex flex-col items-center text-center ml-4">
              <img src="/elements/15.png" alt="" className="w-[120px]" />
              <h2 className="my-6 text-xl md:text-3xl font-bold">ميني-دوكس</h2>
              <p className="text-lg md:text-xl" dir="rtl">
                وثائقيات قصيرة تعيد إحياء لحظات و محطات بارزة من تاريخ البوب
                العربي.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <img src="/elements/14.png" alt="" className="w-[120px]" />
              <h2 className="my-6 text-xl md:text-3xl font-bold">لقاءات</h2>
              <p className="text-lg md:text-xl" dir="rtl">
                حوارات تكشف كواليس الصناعة و أسرار الإبداع من داخل الوسط الفني و
                مع الجمهور.
              </p>
            </div>
          </Slide>
        </div>
      </div>
      <Marquee />
      <div
        className="flex flex-col lg:flex-row items-center justify-center w-full gap-10 md:gap-20"
        dir="rtl"
      >
        <div className="w-[75%] md:w-[50%] lg:w-[25%]">
          <Zoom triggerOnce>
            <h3 className="text-lg flex flex-row-reverse justify-center gap-2 items-center md:text-2xl mx-auto font-bold mb-3 md:mb-10 w-fit">
              <BookOpen />
              اطلع على مقالاتنا
            </h3>
          </Zoom>
          <Slide direction="up" triggerOnce>
            {article && (
              <ArticleCard article={article} onClick={handleArticleClick} />
            )}
            {!article && (
              <div className="text-center text-gray-400">
                لا توجد مقالات متاحة حالياً
              </div>
            )}
          </Slide>
        </div>
        <div className="w-[75%] md:w-[50%] lg:w-[25%]">
          <Zoom triggerOnce>
            <h3 className="text-lg flex flex-row-reverse justify-center gap-2 items-center md:text-2xl mx-auto font-bold mb-3 md:mb-10 w-fit">
              <Headphones />
              أحدث الحلقات
            </h3>
          </Zoom>
          <Slide direction="up" triggerOnce>
            {podcast && (
              <PodcastCard podcast={podcast} onClick={handlePodcastClick} />
            )}
            {!podcast && (
              <div className="text-center text-gray-400">
                لا توجد حلقات متاحة حالياً
              </div>
            )}
          </Slide>
        </div>
      </div>
      <Marquee />
    </section>
  );
};

export default About;
