"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, BookOpen, Headphones, Share2 } from "lucide-react";
import { isAdmin } from "@/app/utils/auth";

interface Category {
  _id: string;
  name: string;
  slug: string;
  type: string;
}

interface PodcastDetailPageProps {
  initialPodcast: any;
}

const PodcastDetailPage = ({ initialPodcast }: PodcastDetailPageProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const [podcast, setPodcast] = useState(initialPodcast);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [recentArticles, setRecentArticles] = useState([]);
  const [recentPodcasts, setRecentPodcasts] = useState([]);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const [editForm, setEditForm] = useState({
    title: initialPodcast.title || "",
    description: initialPodcast.description || "",
    category: initialPodcast.category?._id || "",
    tags: Array.isArray(initialPodcast.tags)
      ? initialPodcast.tags.join(", ")
      : "",
    spotify: initialPodcast.spotify || "",
    appleMusic: initialPodcast.appleMusic || "",
    anghami: initialPodcast.anghami || "",
    youtube: initialPodcast.youtube || "",
    audioUrl: initialPodcast.audioUrl || "",
    videoUrl: initialPodcast.videoUrl || "",
  });

  const isUserAdmin = isAdmin(session);

  useEffect(() => {
    fetchRecentContent();
  }, []);

  useEffect(() => {
    if (showEditModal) {
      fetchCategories();
    }
  }, [showEditModal]);

  const fetchRecentContent = async () => {
    try {
      const articlesRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/article?limit=5&sort=-date`
      );
      if (articlesRes.ok) {
        const articlesData = await articlesRes.json();
        setRecentArticles(articlesData.articles || []);
      }

      const podcastsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/podcast?limit=5&sort=-createdAt`
      );
      if (podcastsRes.ok) {
        const podcastsData = await podcastsRes.json();
        setRecentPodcasts(podcastsData.podcasts || []);
      }
    } catch (error) {
      console.error("Error fetching recent content:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/category?type=podcast`
      );
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = podcast.title;

  const handleShare = (platform: string) => {
    let url = "";

    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          shareUrl
        )}&text=${encodeURIComponent(shareTitle)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "copy":
        navigator.clipboard.writeText(shareUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        return;
    }

    if (url) {
      window.open(url, "_blank", "width=600,height=400");
    }
  };

  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;

    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/podcast/${podcast._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("فشل في حذف البودكاست");
      }

      router.push("/podcast");
    } catch (err: any) {
      alert(err.message || "فشل في حذف البودكاست");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleUpdate = async () => {
    router.push(`/podcast/edit/${podcast._id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const youtubeVideoId = getYouTubeVideoId(podcast.youtube);

  return (
    <main className="flex flex-col items-center font-emirates bg-gray-50 overflow-x-hidden min-h-screen">
      <section className="w-screen flex flex-col h-[400px] overflow-y-hidden relative">
        <img
          src={podcast.thumbnailUrl || "/images/podcast.jpg"}
          className="w-full h-full object-cover object-center"
          alt={podcast.title}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        <h1
          dir="rtl"
          className="font-bold text-4xl text-right absolute bottom-4 right-4 md:right-[3%] text-white z-10 max-w-[1100px] drop-shadow-lg px-4"
        >
          {podcast.title}
        </h1>
      </section>

      <div className="w-full max-w-[1400px] flex flex-col lg:flex-row-reverse gap-8 px-4 py-8">
        <section className="flex-1 lg:flex lg:flex-col bg-gray-50 relative">
          <ArrowLeft
            className="text-primary mb-4 cursor-pointer transition hover:opacity-70"
            onClick={() => router.back()}
          />

          {isUserAdmin && (
            <div
              dir="rtl"
              className="mb-6 p-4 bg-white rounded-lg border border-gray-300 shadow-sm"
            >
              <div className="flex flex-wrap w-full justify-center gap-3">
                <button
                  onClick={() => handleUpdate()}
                  className="px-4 py-2 bg-gray-600 cursor-pointer text-white rounded-lg hover:opacity-80 transition"
                >
                  تعديل البودكاست
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 cursor-pointer text-white rounded-lg hover:bg-red-700 transition"
                >
                  حذف البودكاست
                </button>
              </div>
            </div>
          )}

          <div className="relative inline-block mb-6 w-full ml-auto">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center ml-auto gap-2 px-4 py-2 bg-primary text-white rounded-lg cursor-pointer transition"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة</span>
            </button>

            {showShareMenu && (
              <div
                dir="rtl"
                className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-20 min-w-[200px]"
              >
                <button
                  onClick={() => handleShare("facebook")}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition text-right"
                >
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>فيسبوك</span>
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition text-right"
                >
                  <svg
                    className="w-5 h-5 text-blue-700"
                    fill="black"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2H21.5l-7.61 8.67L22.5 22h-6.79l-5.3-6.93L4.5 22H1.24l8.15-9.29L1.5 2h6.92l4.73 6.2L18.24 2z" />
                  </svg>

                  <span>إكس</span>
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition text-right"
                >
                  <svg
                    className="w-5 h-5 text-blue-700"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span>لينكد إن</span>
                </button>
                <button
                  onClick={() => handleShare("copy")}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition text-right"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  <span>{copySuccess ? "تم النسخ!" : "نسخ الرابط"}</span>
                </button>
              </div>
            )}
          </div>

          {podcast.description && (
            <h2
              dir="rtl"
              className="text-right text-xl mb-6 text-gray-800 leading-relaxed"
            >
              {podcast.description}
            </h2>
          )}

          {podcast.tags && podcast.tags.length > 0 && (
            <div dir="rtl" className="flex flex-wrap gap-2 mb-6">
              {podcast.tags.map((tag: string, index: number) => (
                <a href={`/podcast?tags=${tag}`} key={index}>
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition cursor-pointer">
                    #{tag}
                  </span>
                </a>
              ))}
            </div>
          )}

          {podcast.category && (
            <div dir="rtl" className="mb-6">
              <span className="text-sm text-gray-600">التصنيف: </span>
              <a
                href={`/podcast?category=${podcast.category._id}`}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition"
              >
                {podcast.category.name}
              </a>
            </div>
          )}

          {youtubeVideoId && (
            <div className="mb-8">
              <h3
                dir="rtl"
                className="mb-3 text-lg font-semibold text-gray-800"
              >
                شاهد على يوتيوب:
              </h3>
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                  src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {(podcast.spotify || podcast.appleMusic || podcast.anghami) && (
            <>
              <h3
                dir="rtl"
                className="mt-4 mb-3 text-lg font-semibold text-gray-800"
              >
                استمع على:
              </h3>
              <div className="flex flex-wrap gap-6 justify-end p-5">
                {podcast.spotify && (
                  <a
                    href={podcast.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-all transform hover:scale-110"
                    title="Spotify"
                  >
                    <img
                      src="https://cdnjs.cloudflare.com/ajax/libs/simple-icons/9.21.0/spotify.svg"
                      alt="Spotify"
                      className="w-10 h-10"
                      style={{
                        filter:
                          "invert(30%) sepia(99%) saturate(2000%) hue-rotate(95deg) brightness(108%) contrast(101%)",
                      }}
                    />
                  </a>
                )}

                {podcast.appleMusic && (
                  <a
                    href={podcast.appleMusic}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-800 hover:text-gray-900 transition-all transform hover:scale-110"
                    title="Apple Music"
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
                  </a>
                )}

                {podcast.anghami && (
                  <a
                    href={podcast.anghami}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-all transform hover:scale-110"
                    title="Anghami"
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
                  </a>
                )}
              </div>
            </>
          )}

          {podcast.audioUrl && (
            <div className="mt-8">
              <h3
                dir="rtl"
                className="mb-3 text-lg font-semibold text-gray-800"
              >
                استمع الآن:
              </h3>
              <audio controls className="w-full rounded-lg shadow-sm">
                <source src={podcast.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {podcast.videoUrl && (
            <div className="mt-8">
              <h3
                dir="rtl"
                className="mb-3 text-lg font-semibold text-gray-800"
              >
                شاهد الآن:
              </h3>
              <video controls className="w-full rounded-lg shadow-lg">
                <source src={podcast.videoUrl} type="video/mp4" />
                Your browser does not support the video element.
              </video>
            </div>
          )}
        </section>

        <aside className="lg:w-80 space-y-6">
          <h3
            className="text-lg font-bold mb-4 text-right text-primary"
            dir="rtl"
          >
            <BookOpen className="inline w-6 h-6 mx-2" />
            أحدث المقالات
          </h3>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="space-y-3">
              {recentArticles.map((item: any) => (
                <a
                  key={item._id}
                  href={`/article/${item._id}`}
                  className="block group"
                >
                  <div className="flex gap-3 items-start" dir="rtl">
                    <img
                      src={item.thumbnail || "/images/article.jpg"}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-800 group-hover:text-red-600 transition line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(item.date)}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <h3
            className="text-lg font-bold mb-4 text-right text-primary"
            dir="rtl"
          >
            <Headphones className="inline w-6 h-6 mx-2" />
            أحدث الحلقات
          </h3>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="space-y-3">
              {recentPodcasts.map((item: any) => (
                <a
                  key={item._id}
                  href={`/podcast/${item._id}`}
                  className="block group"
                >
                  <div className="flex gap-3 items-start" dir="rtl">
                    <img
                      src={item.thumbnailUrl || "/images/podcast.jpg"}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-800 group-hover:text-red-600 transition line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="fixed top-0 left-0 right-0 bottom-0"
            onClick={() => setShowDeleteModal(false)}
          ></div>
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative z-10">
            <h3 className="text-xl font-bold mb-4 text-right" dir="rtl">
              تأكيد الحذف
            </h3>
            <p className="text-gray-700 mb-6 text-right" dir="rtl">
              هل أنت متأكد من حذف هذا البودكاست؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {isDeleting ? "جاري الحذف..." : "حذف"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div
            className="fixed top-0 left-0 right-0 bottom-0"
            onClick={() => setShowEditModal(false)}
          ></div>
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full my-8 relative z-10 max-h-[90vh] overflow-y-auto">
            <h3
              className="text-xl font-bold mb-4 text-right sticky top-0 bg-white pb-2 border-b"
              dir="rtl"
            >
              تعديل البودكاست
            </h3>

            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
              dir="rtl"
            >
              <div>
                <label className="block text-sm font-semibold mb-2">
                  العنوان *
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  التصنيف
                </label>
                <select
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
                >
                  <option value="">اختر تصنيف</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  الوسوم (مفصولة بفواصل)
                </label>
                <input
                  type="text"
                  value={editForm.tags}
                  onChange={(e) =>
                    setEditForm({ ...editForm, tags: e.target.value })
                  }
                  placeholder="وسم1, وسم2, وسم3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  الوصف
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="اكتب وصفاً للحلقة..."
                />
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <h4 className="text-sm font-semibold mb-4 text-right" dir="rtl">
                روابط المنصات
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir="rtl">
                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                    <img
                      src="https://cdnjs.cloudflare.com/ajax/libs/simple-icons/9.21.0/spotify.svg"
                      alt="Spotify"
                      className="w-4 h-4"
                      style={{
                        filter:
                          "invert(30%) sepia(99%) saturate(2000%) hue-rotate(95deg) brightness(108%) contrast(101%)",
                      }}
                    />
                    Spotify
                  </label>
                  <input
                    type="url"
                    value={editForm.spotify}
                    onChange={(e) =>
                      setEditForm({ ...editForm, spotify: e.target.value })
                    }
                    placeholder="https://open.spotify.com/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                    <img
                      src="https://cdnjs.cloudflare.com/ajax/libs/simple-icons/9.21.0/applemusic.svg"
                      alt="Apple Music"
                      className="w-4 h-4"
                    />
                    Apple Music
                  </label>
                  <input
                    type="url"
                    value={editForm.appleMusic}
                    onChange={(e) =>
                      setEditForm({ ...editForm, appleMusic: e.target.value })
                    }
                    placeholder="https://music.apple.com/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Anghami_Icon.png"
                      alt="Anghami"
                      className="w-4 h-4"
                    />
                    Anghami
                  </label>
                  <input
                    type="url"
                    value={editForm.anghami}
                    onChange={(e) =>
                      setEditForm({ ...editForm, anghami: e.target.value })
                    }
                    placeholder="https://play.anghami.com/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                    <img
                      src="https://cdnjs.cloudflare.com/ajax/libs/simple-icons/9.21.0/youtube.svg"
                      alt="YouTube"
                      className="w-4 h-4"
                      style={{
                        filter:
                          "invert(25%) sepia(98%) saturate(7426%) hue-rotate(356deg) brightness(99%) contrast(118%)",
                      }}
                    />
                    YouTube
                  </label>
                  <input
                    type="url"
                    value={editForm.youtube}
                    onChange={(e) =>
                      setEditForm({ ...editForm, youtube: e.target.value })
                    }
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t sticky bottom-0 bg-white">
              <button
                onClick={() => setShowEditModal(false)}
                disabled={isUpdating}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="px-6 py-2 bg-primary text-white rounded-lg cursor-pointer transition disabled:opacity-50 min-w-[120px]"
              >
                {isUpdating ? "جاري التحديث..." : "حفظ التغييرات"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default PodcastDetailPage;
