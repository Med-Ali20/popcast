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

const footer = () => {
  return (
    <footer className="z-20 pb-6 pt-8 lg:w-[45%] w-[90%] flex items-center">
      <div className="gap-4 hidden lg:flex items-center mx-auto">
        <SiYoutube size={25} color="white" className="cursor-pointer" />
        <SiInstagram size={25} color="white" className="cursor-pointer" />
        <SiFacebook size={25} color="white" className="cursor-pointer" />
        <SiX size={25} color="white" className="cursor-pointer" />
        <SiTiktok size={25} color="white" className="cursor-pointer" />
        <SiThreads size={25} color="white" className="cursor-pointer" />
      </div>
      <div className="gap-4 flex lg:hidden items-center mx-auto">
        <SiYoutube size={15} color="white" className="cursor-pointer" />
        <SiInstagram size={15} color="white" className="cursor-pointer" />
        <SiFacebook size={15} color="white" className="cursor-pointer" />
        <SiX size={15} color="white" className="cursor-pointer" />
        <SiTiktok size={15} color="white" className="cursor-pointer" />
        <SiThreads size={15} color="white" className="cursor-pointer" />
      </div>
      <img src="/elements/25.png" alt="" className="w-[25%] lg:w-[30%] mx-auto" />
      <p className="text-white mr-auto lg:text-2xl text-xs">2025 © </p>
    </footer>
  );
};

export default footer;
