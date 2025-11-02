import React from "react";
import {
  SiYoutube,
  SiInstagram,
  SiFacebook,
  SiX,
  SiTiktok,
  SiThreads,
} from "@icons-pack/react-simple-icons";
import "./styles.css";

const Footer = () => {
  const socialLinks = {
    youtube: "https://youtube.com/@itspopcast",
    instagram: "https://instagram.com/itspopcast",
    facebook: "https://facebook.com/itspopcast",
    x: "https://x.com/itspopcast",
    tiktok: "https://tiktok.com/@itspopcast",
    threads: "https://www.threads.net/@itspopcast",
  };

  return (
    <footer className="w-full bg-primary relative overflow-hidden min-h-[70px] lg:h-auto">
      <div className="z-20 pb-4 pt-10 w-[300px] lg:w-[450px] absolute left-0 bottom-0 w-[90%] bg-primary flex items-center bg-[url('/elements/24.png')] bg-no-repeat bg-contain bg-left-bottom">
        {/* Desktop icons */}
        <div className="gap-4 hidden lg:flex items-center mx-4">
          <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">
            <SiYoutube size={15} color="white" className="cursor-pointer hover:opacity-75" />
          </a>
          <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
            <SiInstagram size={15} color="white" className="cursor-pointer hover:opacity-75" />
          </a>
          <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
            <SiFacebook size={15} color="white" className="cursor-pointer hover:opacity-75" />
          </a>
          <a href={socialLinks.x} target="_blank" rel="noopener noreferrer">
            <SiX size={15} color="white" className="cursor-pointer hover:opacity-75" />
          </a>
          <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer">
            <SiTiktok size={15} color="white" className="cursor-pointer hover:opacity-75" />
          </a>
          <a href={socialLinks.threads} target="_blank" rel="noopener noreferrer">
            <SiThreads size={15} color="white" className="cursor-pointer hover:opacity-75" />
          </a>
        </div>

        {/* Mobile icons */}
        <div className="gap-2 flex lg:hidden items-center mx-4">
          <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">
            <SiYoutube size={10} color="white" className="cursor-pointer hover:opacity-75" />
          </a>
          <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
            <SiInstagram size={10} color="white" className="cursor-pointer hover:opacity-75" />
          </a>
          <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
            <SiFacebook size={10} color="white" className="cursor-pointer hover:opacity-75" />
          </a>
          <a href={socialLinks.x} target="_blank" rel="noopener noreferrer">
            <SiX size={10} color="white" className="cursor-pointer hover:opacity-75" />
          </a>
          <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer">
            <SiTiktok size={10} color="white" className="cursor-pointer hover:opacity-75" />
          </a>
          <a href={socialLinks.threads} target="_blank" rel="noopener noreferrer">
            <SiThreads size={10} color="white" className="cursor-pointer hover:opacity-75" />
          </a>
        </div>

        <img src="/elements/25.png" alt="" className="w-[20%] lg:w-[25%] mx-4" />
        <p className="text-white mr-auto lg:text-sm text-[10px]">2025 ©</p>
      </div>
    </footer>
  );
};

export default Footer;
