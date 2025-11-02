"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Upload, X } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  type: string;
}

const PodcastEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const { slug } = params;
  const { data: session, status } = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    thumbnail: "",
    spotify: "",
    appleMusic: "",
    anghami: "",
    youtube: "",
    audioUrl: "",
    videoUrl: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
    fetchPodcast();
    fetchCategories();
  }, [slug, status]);

  const fetchPodcast = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/podcast/${slug}`
      );
      if (!response.ok) throw new Error("Failed to fetch podcast");

      const podcast = await response.json();
      setFormData({
        title: podcast.title || "",
        description: podcast.description || "",
        category: podcast.category?._id || "",
        tags: Array.isArray(podcast.tags) ? podcast.tags.join(", ") : "",
        thumbnail: podcast.thumbnailUrl || "",
        spotify: podcast.spotify || "",
        appleMusic: podcast.appleMusic || "",
        anghami: podcast.anghami || "",
        youtube: podcast.youtube || "",
        audioUrl: podcast.audioUrl || "",
        videoUrl: podcast.videoUrl || "",
      });
      setThumbnailPreview(podcast.thumbnailUrl || "");
    } catch (error) {
      console.error("Error fetching podcast:", error);
      alert("فشل في تحميل البودكاست");
    } finally {
      setIsLoading(false);
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

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview("");
    setFormData((prev) => ({ ...prev, thumbnail: "" }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert("الرجاء إدخال عنوان البودكاست");
      return;
    }

    setIsUpdating(true);

    try {
      let thumbnailUrl = formData.thumbnail;

      // Upload new thumbnail if one is selected
      if (thumbnailFile) {
        const formDataUpload = new FormData();
        formDataUpload.append("thumbnail", thumbnailFile);
        formDataUpload.append("title", "temp_" + Date.now());

        const uploadResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/podcast`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
            body: formDataUpload,
          }
        );

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          thumbnailUrl = uploadData.thumbnailUrl;

          // Delete temporary podcast used for upload
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/podcast/${uploadData._id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${session?.accessToken}`,
              },
            }
          );
        }
      }

      const updateData: any = {
        title: formData.title,
        description: formData.description || undefined,
        category: formData.category || undefined,
        thumbnailUrl: thumbnailUrl || undefined,
        spotify: formData.spotify || undefined,
        appleMusic: formData.appleMusic || undefined,
        anghami: formData.anghami || undefined,
        youtube: formData.youtube || undefined,
        audioUrl: formData.audioUrl || undefined,
        videoUrl: formData.videoUrl || undefined,
      };

      if (formData.tags.trim()) {
        updateData.tags = formData.tags
          .split(",")
          .map((tag: string) => tag.trim());
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/podcast/${slug}`,
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

      alert("تم تحديث البودكاست بنجاح");
      router.push(`/podcast/${slug}`);
    } catch (error: any) {
      alert(error.message || "فشل في تحديث البودكاست");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <ArrowLeft
            className="text-primary cursor-pointer hover:opacity-70 transition"
            onClick={() => router.back()}
          />
          <h1 className="text-3xl ml-auto font-bold" dir="rtl">
            تعديل البودكاست
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Thumbnail */}
          <div className="mb-6" dir="rtl">
            <label className="block text-sm font-semibold mb-2">
              الصورة المصغرة
            </label>

            {thumbnailPreview ? (
              <div className="relative">
                <img
                  src={thumbnailPreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">اضغط لرفع صورة</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                  id="thumbnail-upload"
                />
                <label
                  htmlFor="thumbnail-upload"
                  className="inline-block px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:opacity-90 transition"
                >
                  اختر صورة
                </label>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" dir="rtl">
            <div>
              <label className="block text-sm font-semibold mb-2">
                العنوان *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                التصنيف
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer bg-white"
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
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="وسم1, وسم2, وسم3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">الوصف</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="اكتب وصفاً للحلقة..."
              />
            </div>
          </div>

          {/* Platform Links */}
          <div className="border-t pt-6 mb-6">
            <h4 className="text-lg font-semibold mb-4 text-right" dir="rtl">
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
                  value={formData.spotify}
                  onChange={(e) =>
                    setFormData({ ...formData, spotify: e.target.value })
                  }
                  placeholder="https://open.spotify.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
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
                  value={formData.appleMusic}
                  onChange={(e) =>
                    setFormData({ ...formData, appleMusic: e.target.value })
                  }
                  placeholder="https://music.apple.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
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
                  value={formData.anghami}
                  onChange={(e) =>
                    setFormData({ ...formData, anghami: e.target.value })
                  }
                  placeholder="https://play.anghami.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
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
                  value={formData.youtube}
                  onChange={(e) =>
                    setFormData({ ...formData, youtube: e.target.value })
                  }
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  رابط الملف الصوتي (Audio URL)
                </label>
                <input
                  type="url"
                  value={formData.audioUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, audioUrl: e.target.value })
                  }
                  placeholder="https://example.com/audio.mp3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  رابط الفيديو (Video URL)
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, videoUrl: e.target.value })
                  }
                  placeholder="https://example.com/video.mp4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isUpdating}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isUpdating}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 min-w-[120px]"
            >
              {isUpdating ? "جاري التحديث..." : "حفظ التغييرات"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PodcastEditPage;