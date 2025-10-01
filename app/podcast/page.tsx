"use client";

import React, { useState } from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Play } from "lucide-react";

// @ts-ignore

const GridBlock = ({ bgColor, title, description }) => {
  return (
    <div
      dir="rtl"
      className={`${bgColor} relative overflow-hidden rounded-lg cursor-pointer group transition-transform duration-300 hover:scale-102`}
    >
      {/* Play icon - appears on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 mb-8 border border-white/30">
          <Play className="w-8 h-8 text-white fill-white z-10 block" />
        </div>
      </div>

      {/* Content at bottom with gradient background */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* Gradient background for text */}
        <div className="bg-gradient-to-t from-black/60 via-black/30 to-transparent p-6 text-white">
          <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-xl font-bold mb-2 drop-shadow-lg">{title}</h3>
            <p className="text-sm opacity-90 leading-relaxed drop-shadow-md">
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
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 4) {
        // Show: 1 2 3 4 5 ... last
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Show: 1 ... last-4 last-3 last-2 last-1 last
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show: 1 ... current-1 current current+1 ... last
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 cursor-pointer text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
        السابق
      </button>

      {/* Page numbers */}
      <div className="flex gap-1">
        {generatePageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-sm font-medium text-gray-500">
                ...
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 cursor-pointer text-sm font-medium rounded-lg transition-colors ${
                  currentPage === page
                    ? 'text-blue-600 bg-blue-50 border border-blue-300'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next button */}
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

const page = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // You can adjust this value

  const categories = [
    "All Categories",
    "Web Development",
    "Mobile Apps",
    "Digital Marketing",
    "Design",
    "Consulting",
    "E-commerce",
    "SEO Services",
  ];

  const categories2 = [
    "All Categories",
    "Web Development",
    "Mobile Apps",
    "Digital Marketing",
    "Design",
    "Consulting",
    "E-commerce",
    "SEO Services",
    "All Categories",
    "Web Development",
    "Mobile Apps",
    "Digital Marketing",
    "Design",
    "Consulting",
    "E-commerce",
    "SEO Services21",
    "All Categories",
    "Web Development234",
    "Mobile Apps",
    "Digital Marketing",
    "Design",
    "Consulting",
    "E-commerce123",
    "SEO Services44",
  ];

  // Calculate pagination values
  const totalItems = categories2.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = categories2.slice(startIndex, endIndex);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Here you can make your server request with the new page number
    console.log(`Fetching data for page ${page}`);
    // Example: fetchDataFromServer(page, itemsPerPage);
  };

  // Function you can use for server requests
  const fetchDataFromServer = async (page: number, limit: number) => {
    try {
      const response = await fetch(`/api/data?page=${page}&limit=${limit}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <main className="bg-gray-100 font-emirates">
      <div className="relative w-full h-[70px] pr-8 md:pr-0 justify-center bg-gray-300 py-6 flex flex-row-reverse gap-5 items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            dir="rtl"
            className="w-[200px] md:w-[400px] text-right bg-white border border-gray-300 rounded-full h-[40px] pl-12 pr-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>
        <div dir="rtl" className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-white border border-gray-300 rounded-full h-[40px] px-4 pr-10 ml-8 flex items-center gap-2 min-w-[80px] md:min-w-[160px] hover:border-blue-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <span className="text-gray-700 text-sm truncate">
              {selectedCategory}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-blue-600 absolute right-3 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {categories.map((category, index) => (
                <button
                  dir="rtl"
                  key={index}
                  onClick={() => handleCategorySelect(category)}
                  className={`w-full text-right px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <section className="grid grid-cols-1 w-[100vw] md:grid-cols-2 h-[800px] md:h-[600px] gap-4 max-w-[1100px] mx-auto py-10 px-5">
        <GridBlock
          bgColor="bg-blue-500"
          title="تيست"
          description="Discover our latest innovative solution that transforms the way you work and collaborate with your team."
        />
        <GridBlock
          bgColor="bg-yellow-500 md:row-span-2"
          title="Creative Design"
          description="Explore stunning visual designs that capture attention and deliver results."
        />
        <GridBlock
          bgColor="bg-yellow-500"
          title="Brand Identity"
          description="Build a strong brand presence with our comprehensive identity solutions."
        />
      </section>

      <section>
        <div className="max-w-[1100px] mx-auto py-5 px-5">
          {/* Pagination info */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-700">
              عرض {startIndex + 1} - {Math.min(endIndex, totalItems)} من {totalItems} عنصر
            </div>
            <div className="text-sm text-gray-700">
              الصفحة {currentPage} من {totalPages}
            </div>
          </div>
          
          {/* Grid items */}
          <div
            dir="rtl"
            className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full"
          >
            {currentItems.map((category, index) => (
              <GridBlock
                key={startIndex + index} // Use startIndex for unique keys across pages
                bgColor="bg-green-500 h-[250px]"
                title={category}
                description="Modern, responsive websites built with cutting-edge technology."
              />
            ))}
          </div>
          
          {/* Pagination component */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </section>
    </main>
  );
};

export default page;