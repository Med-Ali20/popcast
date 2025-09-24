'use client';

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-primary text-secondary flex w-full items-center px-6 md:px-12 py-4 lg:py-2 sticky top-0 z-10 font-emirates">
        <img src="/elements/08.png" className="w-[50px] md:w-[100px] mr-auto" alt="" />
        
        {/* Desktop Menu */}
        <ul className="flex items-center justify-around font-semibold text-xl hidden md:flex list-none">
          <li className="mx-4">
            <Link href="/contact" className="text-secondary no-underline"> التواصل </Link>
          </li>
          <li className="mx-4">
            <Link href="/articles" className="text-secondary no-underline"> المقالات </Link>
          </li>
          <li className="mx-4">
            <Link href="/podcast" className="text-secondary no-underline"> البودكاست </Link>
          </li>
          <li className="mr-4 ml-12">
            <Link href="/"> <img src="/elements/26.png" className="w-[60px]" alt="" /> </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-secondary p-2 focus:outline-none"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0  bg-[rgba(0,0,0,0.5)] z-20 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu */}
      <div dir="rtl" className={`fixed top-0 right-0 h-full w-80 bg-primary text-secondary transform transition-transform duration-300 ease-in-out z-30 md:hidden ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Menu Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary/20">
          <img src="/elements/26.png" className="w-[50px]" alt="" />
          <button
            onClick={closeMenu}
            className="text-secondary p-2 focus:outline-none"
            aria-label="Close menu"
          >
            <X className="cursor-pointer" size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col p-6 space-y-6 font-emirates">
          <Link 
            href="/" 
            className="text-secondary no-underline text-xl font-semibold py-2 border-b border-secondary/10"
            onClick={closeMenu}
          >
            الرئيسية
          </Link>
          <Link 
            href="/podcast" 
            className="text-secondary no-underline text-xl font-semibold py-2 border-b border-secondary/10"
            onClick={closeMenu}
          >
            البودكاست
          </Link>
          <Link 
            href="/articles" 
            className="text-secondary no-underline text-xl font-semibold py-2 border-b border-secondary/10"
            onClick={closeMenu}
          >
            المقالات
          </Link>
          <Link 
            href="/contact" 
            className="text-secondary no-underline text-xl font-semibold py-2 border-b border-secondary/10"
            onClick={closeMenu}
          >
            التواصل
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Header;