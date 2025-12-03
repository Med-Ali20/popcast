"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Play,
  ArrowLeft,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

interface Category {
  _id: string;
  name: string;
}

export const dynamic = "force-dynamic";

// @ts-ignore
const GridBlock = ({ bgColor, title, description, onClick, thumbnailUrl }) => {
  return (
    <div
      dir="rtl"
      onClick={onClick}
      className={`${
        thumbnailUrl ? "" : bgColor
      } min-h-[300px] relative overflow-hidden rounded-lg cursor-pointer group transition-transform duration-300 hover:scale-102`}
    >
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 mb-8 border border-white/30">
          <Play className="w-8 h-8 text-white fill-white z-10 block" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <div className="bg-gradient-to-t from-black/60 via-black/30 to-transparent p-6 text-white">
          <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-xl font-bold mb-2 drop-shadow-lg">{title}</h3>
            <p className="text-sm opacity-90 leading-relaxed drop-shadow-md line-clamp-2">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// @ts-ignore
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const generatePageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div dir="rtl" className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 cursor-pointer text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4" />
        السابق
      </button>

      <div className="flex gap-1">
        {generatePageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-3 py-2 text-sm font-medium text-gray-500">
                ...
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 cursor-pointer text-sm font-medium rounded-lg transition-colors ${
                  currentPage === page
                    ? "text-blue-600 bg-blue-50 border border-blue-300"
                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center cursor-pointer gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        التالي
        <ChevronLeft className="w-4 h-4" />
      </button>
    </div>
  );
};

const PodcastPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [podcasts, setPodcasts] = useState([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPodcasts: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    limit: 6,
  });
  const [isLoading, setIsLoading] = useState(false);
  const params = useSearchParams();
  const router = useRouter();
  const tags = params.get("tags");
  const categoryParam = params.get("category");

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Set category from URL parameter
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchPodcasts = async (page: number, search = "", category = "") => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "6",
      });

      if (search) {
        params.append("search", search);
      }

      if (category) {
        params.append("category", category);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/podcast?${params}`);
      const data = await response.json();

      setPodcasts(data.podcasts || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching podcasts:", error);
      setPodcasts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPodcasts(currentPage, tags ?? searchQuery, selectedCategory);
  }, [currentPage, searchQuery, selectedCategory]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setCurrentPage(1);

    // Update URL
    const newParams = new URLSearchParams(params.toString());
    if (category) {
      newParams.set("category", category);
    } else {
      newParams.delete("category");
    }
    router.push(`/podcast?${newParams.toString()}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePodcastClick = (podcast: any) => {
    window.location.href = `/podcast/${podcast._id}`;
  };

  return (
    <main className="bg-gray-100 min-h-screen font-emirates">
      {/* Search and Filter Bar */}
      <div className="relative w-full h-[70px] pr-8 md:pr-0 justify-center bg-gray-300 py-6 flex flex-row-reverse gap-5 items-center">
        {/* Category Filter */}
        <div className="relative w-fit">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="h-[40px] px-4 pr-10 bg-white border border-gray-300 appearance-none rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 cursor-pointer text-sm"
            dir="rtl"
          >
            <option value="">كل التصنيفات</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Lucide arrow icon */}
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
            size={18}
          />
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="البحث..."
            dir="rtl"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-[200px] md:w-[400px] text-right bg-white border border-gray-300 rounded-full h-[40px] pl-12 pr-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>
      </div>

      {/* Podcasts Grid Section */}
      <section>
        <ArrowLeft
          className="text-primary m-5 cursor-pointer"
          onClick={() => router.back()}
        />

        <div className="max-w-[1100px] mx-auto py-5 px-5">
          {/* Pagination info */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-700">
              عرض {(pagination.currentPage - 1) * pagination.limit + 1} -{" "}
              {Math.min(
                pagination.currentPage * pagination.limit,
                pagination.totalPodcasts
              )}{" "}
              من {pagination.totalPodcasts} عنصر
            </div>
            <div className="text-sm text-gray-700">
              الصفحة {pagination.currentPage} من {pagination.totalPages}
            </div>
          </div>

          {/* Grid items */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600">جاري التحميل...</div>
            </div>
          ) : podcasts.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600">لا توجد نتائج</div>
            </div>
          ) : (
            <div
              dir="rtl"
              className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full"
            >
              {podcasts.map((podcast: any, index) => (
                <GridBlock
                  key={podcast._id || index}
                  bgColor="bg-green-500 h-[250px]"
                  title={podcast.title}
                  description={podcast.description}
                  thumbnailUrl={podcast.thumbnailUrl}
                  onClick={() => handlePodcastClick(podcast)}
                />
              ))}
            </div>
          )}

          {/* Pagination component */}
          {!isLoading && podcasts.length > 0 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </section>
    </main>
  );
};

export default PodcastPage;
