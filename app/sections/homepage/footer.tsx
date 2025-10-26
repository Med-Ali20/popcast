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
    <footer className="w-full bg-primary relative overflow-hidden min-h-[70px] lg:h-auto">
      <div className="z-20 pb-4 pt-10 w-[300px] lg:w-[450px] absolute left-0 bottom-0 w-[90%] bg-primary flex items-center  bg-[url('/elements/24.png')] bg-no-repeat bg-contain bg-left-bottom">
        <div className="gap-4 hidden lg:flex items-center mx-4">
          <SiYoutube size={15} color="white" className="cursor-pointer" />
          <SiInstagram size={15} color="white" className="cursor-pointer" />
          <SiFacebook size={15} color="white" className="cursor-pointer" />
          <SiX size={15} color="white" className="cursor-pointer" />
          <SiTiktok size={15} color="white" className="cursor-pointer" />
          <SiThreads size={15} color="white" className="cursor-pointer" />
        </div>
        <div className="gap-2 flex lg:hidden items-center mx-4">
          <SiYoutube size={10} color="white" className="cursor-pointer" />
          <SiInstagram size={10} color="white" className="cursor-pointer" />
          <SiFacebook size={10} color="white" className="cursor-pointer" />
          <SiX size={10} color="white" className="cursor-pointer" />
          <SiTiktok size={10} color="white" className="cursor-pointer" />
          <SiThreads size={10} color="white" className="cursor-pointer" />
        </div>
        <img
          src="/elements/25.png"
          alt=""
          className="w-[20%] lg:w-[25%] mx-4"
        />
        <p className="text-white mr-auto lg:text-sm text-[10px]">2025 © </p>
      </div>
    </footer>
  );
};

export default footer;
