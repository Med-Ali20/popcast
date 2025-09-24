"use client";

import React, { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
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

const page = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

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

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  return (
    <main className="bg-gray-100 font-emirates">
      <div className="relative w-full h-[70px] justify-center bg-gray-300 py-6 flex flex-row-reverse gap-5 items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            dir="rtl"
            className="w-[400px] text-right bg-white border border-gray-300 rounded-full h-[40px] pl-12 pr-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>
        <div dir="rtl" className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-white border border-gray-300 rounded-full h-[40px] px-4 pr-10 ml-8 flex items-center gap-2 min-w-[160px] hover:border-blue-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
      <section className="grid grid-cols-2 h-[600px] gap-4 max-w-[1100px] mx-auto py-10 px-5">
        <GridBlock
          bgColor="bg-blue-500"
          title="تيست"
          description="Discover our latest innovative solution that transforms the way you work and collaborate with your team."
        />
        <GridBlock
          bgColor="bg-yellow-500 row-span-2"
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
          <div dir="rtl" className="grid grid-cols-3 gap-4 w-full">
            <GridBlock
              bgColor="bg-green-500 h-[250px]"
              title="Web Development"
              description="Modern, responsive websites built with cutting-edge technology."
            />
            <GridBlock
              bgColor="bg-green-500 h-[250px]"
              title="Mobile Apps"
              description="Native and cross-platform mobile applications for iOS and Android."
            />
            <GridBlock
              bgColor="bg-green-500 h-[250px]"
              title="Digital Marketing"
              description="Strategic campaigns that drive engagement and boost your online presence."
            />
            <GridBlock
              bgColor="bg-green-500 h-[250px]"
              title="Consulting"
              description="Expert guidance to help your business grow and adapt to market changes."
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default page;
