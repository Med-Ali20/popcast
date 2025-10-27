"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { isAdmin } from "../utils/auth";

export const dynamic = "force-dynamic";

// Types
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

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalArticles: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
}

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Article Card Component
const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  return (
    <div
      dir="rtl"
      onClick={onClick}
      className="relative overflow-hidden rounded-lg cursor-pointer group transition-transform duration-300 hover:scale-102 bg-white shadow-md hover:shadow-xl"
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
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {article.category}
            </span>
          )}
          {article.date && (
            <span>{new Date(article.date).toLocaleDateString("ar-EG")}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {article.title}
        </h3>

        {/* Content preview */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-3">
          {article.content.replace(/<[^>]*>/g, "").substring(0, 150)}...
        </p>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Author */}
        {article.author && (
          <div className="text-sm text-gray-500 border-t pt-3">
            بواسطة: {article.author}
          </div>
        )}
      </div>
    </div>
  );
};

// Pagination Component
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const generatePageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
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
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 cursor-pointer text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
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
                onClick={() => onPageChange(page as number)}
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
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

// Main Articles Page Component
const ArticlesPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalArticles: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    limit: 9,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const isUserAdmin = isAdmin(session);

  const params = useSearchParams();
  const router = useRouter();
  const tags = params.get("tags");

  const fetchArticles = async (
    page: number,
    search: string = "",
    status: string = "all"
  ): Promise<void> => {
    setIsLoading(true);
    const paramsObj: any = {
      page: page.toString(),
      limit: "9",
    };

    // If admin and status filter is not "all", apply the filter
    if (isUserAdmin && status !== "all") {
      paramsObj.status = status;
    } else if (!isUserAdmin) {
      // Non-admin users only see published articles
      paramsObj.status = "published";
    }

    try {
      const params = new URLSearchParams(paramsObj);

      if (search) {
        params.append("search", search);
      }

      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "https://server.itspopcast.com";

      const response = await fetch(`${baseUrl}/article?${params}`);
      const data = await response.json();

      setArticles(data.articles || []);
      console.log("articles data:", data);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(currentPage, tags ?? searchQuery, statusFilter);
  }, [currentPage, searchQuery, statusFilter]);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleArticleClick = (article: Article): void => {
    window.location.href = `/article/${article._id}`;
  };

  return (
    <main className="bg-gray-100 min-h-screen">
      {/* Search Bar */}
      <div className="relative w-full h-[70px] pr-8 md:pr-0 justify-center bg-gray-300 py-6 flex flex-row-reverse gap-5 items-center">
        {/* Status Filter (Admin only) */}

        {isUserAdmin && (
          <div className="relative w-fit">
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="h-[40px] px-4 pr-10 bg-white border border-gray-300 appearance-none rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 cursor-pointer text-sm"
              dir="rtl"
            >
              <option value="all">الكل</option>
              <option value="published">منشور</option>
              <option value="draft">مسودة</option>
              <option value="archived">مؤرشف</option>
            </select>

            {/* Lucide arrow icon */}
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
              size={18}
            />
          </div>
        )}
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="البحث في المقالات..."
            dir="rtl"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-[200px] md:w-[400px] text-right bg-white border border-gray-300 rounded-full h-[40px] pl-12 pr-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>
      </div>

      {/* Articles Grid Section */}
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
                pagination.totalArticles
              )}{" "}
              من {pagination.totalArticles} مقالة
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
          ) : articles.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600">لا توجد مقالات</div>
            </div>
          ) : (
            <div
              dir="rtl"
              className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
            >
              {articles.map((article, index) => (
                <ArticleCard
                  key={article._id || index}
                  article={article}
                  onClick={() => handleArticleClick(article)}
                />
              ))}
            </div>
          )}

          {/* Pagination component */}
          {!isLoading && articles.length > 0 && (
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

export default ArticlesPage;
