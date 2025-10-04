"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const PodcastDetailPage = () => {
  const params = useParams();
  const podcastId = params.slug;
  
  const [podcast, setPodcast] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPodcast = async () => {
      setIsLoading(true);
      setError("");
      
      try {
        const response = await fetch(`http://localhost:3001/podcast/${podcastId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Podcast not found");
          } else if (response.status === 400) {
            throw new Error("Invalid podcast ID");
          } else {
            throw new Error("Failed to load podcast");
          }
        }
        
        const data = await response.json();
        console.log(data);
        setPodcast(data);
      } catch (err: any) {
        console.error("Error fetching podcast:", err);
        setError(err.message || "Failed to load podcast");
      } finally {
        setIsLoading(false);
      }
    };

    if (podcastId) {
      fetchPodcast();
    }
  }, [podcastId]);

  if (isLoading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-secondary">
        <div className="text-xl text-gray-600" dir="rtl">جاري التحميل...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-secondary">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">{error}</div>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
          >
            العودة
          </button>
        </div>
      </main>
    );
  }

  if (!podcast) {
    return null;
  }

  return (
    <main className="flex flex-col items-center bg-secondary font-emirates min-h-screen">
      <section className="w-screen flex flex-col h-[400px] overflow-y-hidden relative">
        <img
          src={podcast.thumbnailUrl || "/images/podcast.jpg"}
          className="w-full h-full object-cover object-center"
          alt={podcast.title}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        <h1
          dir="rtl"
          className="font-bold text-4xl text-right absolute bottom-4 right-[13%] text-white z-10 max-w-[1100px] drop-shadow-lg"
        >
          {podcast.title}
        </h1>
      </section>

      <section className="bg-secondary w-full py-8 max-w-[1100px] px-4">
        {podcast.description && (
          <h2 dir="rtl" className="text-right text-xl mb-6">
            {podcast.description}
          </h2>
        )}

        {/* Tags */}
        {podcast.tags && podcast.tags.length > 0 && (
          <div dir="rtl" className="flex flex-wrap gap-2 mb-6">
            {podcast.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Category */}
        {podcast.category && (
          <div dir="rtl" className="mb-6">
            <span className="text-sm text-gray-600">التصنيف: </span>
            <span className="text-sm font-semibold text-gray-800">
              {podcast.category}
            </span>
          </div>
        )}

        {/* Platform Links */}
        {(podcast.spotify || podcast.appleMusic || podcast.anghami || podcast.youtube) && (
          <>
            <h3 dir="rtl" className="mt-4 mb-3 text-lg font-semibold">
              استمع على:
            </h3>
            <div className="flex flex-wrap gap-6 justify-center">
              {podcast.spotify && (
                <a
                  href={podcast.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
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
              )}

              {podcast.appleMusic && (
                <a
                  href={podcast.appleMusic}
                  target="_blank"
                  rel="noopener noreferrer"
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
              )}

              {podcast.anghami && (
                <a
                  href={podcast.anghami}
                  target="_blank"
                  rel="noopener noreferrer"
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
              )}

              {podcast.youtube && (
                <a
                  href={podcast.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
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
              )}
            </div>
          </>
        )}

        {/* Audio Player */}
        {podcast.audioUrl && (
          <div className="mt-8">
            <h3 dir="rtl" className="mb-3 text-lg font-semibold">
              استمع الآن:
            </h3>
            <audio controls className="w-full">
              <source src={podcast.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Video Player */}
        {podcast.videoUrl && (
          <div className="mt-8">
            <h3 dir="rtl" className="mb-3 text-lg font-semibold">
              شاهد الآن:
            </h3>
            <video controls className="w-full rounded-lg">
              <source src={podcast.videoUrl} type="video/mp4" />
              Your browser does not support the video element.
            </video>
          </div>
        )}
      </section>
    </main>
  );
};

export default PodcastDetailPage;