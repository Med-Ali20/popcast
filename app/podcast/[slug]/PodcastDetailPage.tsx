'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft } from "lucide-react";
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

  const [editForm, setEditForm] = useState({
    title: initialPodcast.title || "",
    description: initialPodcast.description || "",
    category: initialPodcast.category?._id || "",
    tags: Array.isArray(initialPodcast.tags) ? initialPodcast.tags.join(", ") : "",
    spotify: initialPodcast.spotify || "",
    appleMusic: initialPodcast.appleMusic || "",
    anghami: initialPodcast.anghami || "",
    youtube: initialPodcast.youtube || "",
    audioUrl: initialPodcast.audioUrl || "",
    videoUrl: initialPodcast.videoUrl || "",
  });

  const isUserAdmin = isAdmin(session);

  // Fetch categories when edit modal opens
  useEffect(() => {
    if (showEditModal) {
      fetchCategories();
    }
  }, [showEditModal]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://3.70.229.133:3001/category?type=podcast");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `http://3.70.229.133:3001/podcast/${podcast._id}`,
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
    setIsUpdating(true);
    try {
      const updateData: any = {
        title: editForm.title,
        description: editForm.description,
        category: editForm.category || undefined,
        spotify: editForm.spotify || undefined,
        appleMusic: editForm.appleMusic || undefined,
        anghami: editForm.anghami || undefined,
        youtube: editForm.youtube || undefined,
        audioUrl: editForm.audioUrl || undefined,
        videoUrl: editForm.videoUrl || undefined,
      };

      if (editForm.tags.trim()) {
        updateData.tags = editForm.tags.split(",").map((tag: any) => tag.trim());
      }

      const response = await fetch(
        `http://3.70.229.133:3001/podcast/${podcast._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        throw new Error("فشل في تحديث البودكاست");
      }

      const updatedPodcast = await response.json();
      setPodcast(updatedPodcast);
      setShowEditModal(false);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "فشل في تحديث البودكاست");
    } finally {
      setIsUpdating(false);
    }
  };

  const youtubeVideoId = getYouTubeVideoId(podcast.youtube);

  return (
    <main className="flex flex-col items-center bg-gray-50 min-h-screen">
      {/* Hero Section with Thumbnail */}
      <section className="w-screen flex flex-col h-[400px] overflow-y-hidden relative">
        <img
          src={podcast.thumbnailUrl || "/images/podcast.jpg"}
          className="w-full h-full object-cover object-center"
          alt={podcast.title}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        <h1
          dir="rtl"
          className="font-bold text-4xl text-right absolute bottom-4 right-[13%] text-white z-10 max-w-[1100px] drop-shadow-lg"
        >
          {podcast.title}
        </h1>
      </section>

      {/* Main Content Section */}
      <section className="bg-gray-50 relative w-full py-8 max-w-[1100px] px-4">
        {/* Back Button */}
        <ArrowLeft
          className="text-blue-600 absolute left-4 lg:-left-[10%] top-[10%] cursor-pointer hover:text-blue-700 transition"
          onClick={() => router.back()}
        />
        
        {/* Admin Controls */}
        {isUserAdmin && (
          <div
            dir="rtl"
            className="mb-6 p-4 bg-white rounded-lg border border-gray-300 shadow-sm"
          >
            <div className="flex flex-wrap w-full justify-center gap-3">
              <button
                onClick={() => setShowEditModal(true)}
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

        {/* Description */}
        {podcast.description && (
          <h2 dir="rtl" className="text-right text-xl mb-6 text-gray-800 leading-relaxed">
            {podcast.description}
          </h2>
        )}

        {/* Tags */}
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

        {/* Category */}
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

        {/* YouTube Video Embed */}
        {youtubeVideoId && (
          <div className="mb-8">
            <h3 dir="rtl" className="mb-3 text-lg font-semibold text-gray-800">
              شاهد على يوتيوب:
            </h3>
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
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

        {/* Platform Links (Spotify, Apple Music, Anghami) */}
        {(podcast.spotify || podcast.appleMusic || podcast.anghami) && (
          <>
            <h3 dir="rtl" className="mt-4 mb-3 text-lg font-semibold text-gray-800">
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

        {/* Audio Player */}
        {podcast.audioUrl && (
          <div className="mt-8">
            <h3 dir="rtl" className="mb-3 text-lg font-semibold text-gray-800">
              استمع الآن:
            </h3>
            <audio controls className="w-full rounded-lg shadow-sm">
              <source src={podcast.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Video Player */}
        {podcast.videoUrl && (
          <div className="mt-8">
            <h3 dir="rtl" className="mb-3 text-lg font-semibold text-gray-800">
              شاهد الآن:
            </h3>
            <video controls className="w-full rounded-lg shadow-lg">
              <source src={podcast.videoUrl} type="video/mp4" />
              Your browser does not support the video element.
            </video>
          </div>
        )}
      </section>

      {/* Delete Confirmation Modal */}
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div
            className="fixed top-0 left-0 right-0 bottom-0"
            onClick={() => setShowEditModal(false)}
          ></div>
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full my-8 relative z-10 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-right sticky top-0 bg-white pb-2 border-b" dir="rtl">
              تعديل البودكاست
            </h3>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" dir="rtl">
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

            {/* Platform Links */}
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
                        filter: "invert(30%) sepia(99%) saturate(2000%) hue-rotate(95deg) brightness(108%) contrast(101%)",
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
                        filter: "invert(25%) sepia(98%) saturate(7426%) hue-rotate(356deg) brightness(99%) contrast(118%)",
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

            {/* Action Buttons */}
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
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 min-w-[120px]"
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