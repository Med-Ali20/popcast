"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Music, Play, Headphones, Youtube } from "lucide-react";

const page = () => {
  const params = useParams();

  return (
    <main className="flex flex-col items-center bg-secondary font-emirates min-h-screen">
      <section className="w-screen flex flex-col h-[400px] overflow-y-hidden relative">
        <img
          src="/images/podcast.jpg"
          className="w-full h-full object-cover object-center"
          alt=""
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        <h1
          dir="rtl"
          className="font-bold text-4xl text-right absolute bottom-4 right-[13%] text-white z-10 max-w-[1100px]"
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </h1>
      </section>

      <section className="bg-secondary w-full py-8 max-w-[1100px] px-4">
        <h2 dir="rtl" className="text-right text-xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor qui
          exercitationem molestiae, quisquam, pariatur autem mollitia numquam
          error aperiam ducimus nam deserunt, perferendis corporis iusto fugiat
          iure voluptate a sed!
        </h2>
        <h3 dir="rtl" className="mt-4 mb-3 text-lg font-semibold">
          Listen on:
        </h3>
        <div className="flex flex-wrap gap-15 justify-center">
          <a
            href="#"
            className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:underline transition-colors"
          >
            <img
              src="https://cdnjs.cloudflare.com/ajax/libs/simple-icons/9.21.0/spotify.svg"
              alt="Spotify"
              className="w-10 h-10 filter brightness-0 saturate-100"
              style={{
                filter:
                  "invert(30%) sepia(99%) saturate(2000%) hue-rotate(95deg) brightness(108%) contrast(101%)",
              }}
            />
            Spotify
          </a>
          <a
            href="#"
            className="flex items-center gap-2 text-gray-800 hover:text-gray-900 hover:underline transition-colors"
          >
            <img
              src="https://cdnjs.cloudflare.com/ajax/libs/simple-icons/9.21.0/applemusic.svg"
              alt="Apple Music"
              className="w-10 h-10"
              style={{
                filter:
                  "invert(20%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)",
              }}
            />
            Apple Music
          </a>
          <a
            href="#"
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 hover:underline transition-colors"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Anghami_Icon.png"
              alt="Anghami"
              className="w-10 h-10"
              style={{
                filter:
                  "invert(35%) sepia(99%) saturate(2000%) hue-rotate(260deg) brightness(108%) contrast(101%)",
              }}
            />
            Anghami
          </a>
          <a
            href="#"
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:underline transition-colors"
          >
            <img
              src="https://cdnjs.cloudflare.com/ajax/libs/simple-icons/9.21.0/youtube.svg"
              alt="YouTube"
              className="w-10 h-10"
              style={{
                filter:
                  "invert(18%) sepia(99%) saturate(7404%) hue-rotate(4deg) brightness(95%) contrast(118%)",
              }}
            />
            YouTube
          </a>
        </div> 
      </section>
    </main>
  );
};

export default page;
