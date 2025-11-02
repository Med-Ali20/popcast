"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Upload, X } from "lucide-react";
import { isAdmin } from "@/app/utils/auth";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const ArticleEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const { slug } = params;
  const { data: session, status } = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    category: "",
    tags: "",
    thumbnail: "",
  });


  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/article/${slug}`
      );
      if (!response.ok) throw new Error("Failed to fetch article");

      const article = await response.json();
      setFormData({
        title: article.title || "",
        content: article.content || "",
        author: article.author || "",
        category: article.category || "",
        tags: Array.isArray(article.tags) ? article.tags.join(", ") : "",
        thumbnail: article.thumbnail || "",
      });
      setThumbnailPreview(article.thumbnail || "");
    } catch (error) {
      console.error("Error fetching article:", error);
      alert("فشل في تحميل المقال");
    } finally {
      setIsLoading(false);
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

  // ✅ FIXED: Properly clears both preview and URL
  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview("");
    setFormData((prev) => ({ ...prev, thumbnail: "" }));
  };

  const handleSubmit = async () => {
    setIsUpdating(true);

    try {
      let thumbnailUrl = formData.thumbnail;

      // ✅ Upload new thumbnail if one is selected
      if (thumbnailFile) {
        const formDataUpload = new FormData();
        formDataUpload.append("thumbnail", thumbnailFile);
        formDataUpload.append("title", "temp_" + Date.now());
        formDataUpload.append("content", "temp");

        const uploadResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/article`,
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
          thumbnailUrl = uploadData.thumbnail;

          // Delete temporary article used for upload
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/article/${uploadData._id}`,
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
        content: formData.content,
        author: formData.author,
        category: formData.category,
        thumbnail: thumbnailUrl,
      };

      if (formData.tags.trim()) {
        updateData.tags = formData.tags
          .split(",")
          .map((tag: string) => tag.trim());
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/article/${slug}`,
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
        throw new Error("فشل في تحديث المقال");
      }

      alert("تم تحديث المقال بنجاح");
      router.push(`/article/${slug}`);
    } catch (error: any) {
      alert(error.message || "فشل في تحديث المقال");
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
            تعديل المقال
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* === Thumbnail === */}
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

          {/* === Form Fields === */}
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
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">الكاتب</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                التصنيف
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
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

            {/* ✅ Rich text editor */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">
                المحتوى *
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <CKEditor
                  editor={ClassicEditor as any}
                  data={formData.content}
                  config={{
                    toolbar: [
                      "heading",
                      "|",
                      "bold",
                      "italic",
                      "link",
                      "bulletedList",
                      "numberedList",
                      "|",
                      "blockQuote",
                      "insertTable",
                      "undo",
                      "redo",
                    ],
                  }}
                  onChange={(_, editor) => {
                    const data = editor.getData();
                    setFormData((prev) => ({ ...prev, content: data }));
                  }}
                />
              </div>
            </div>
          </div>

          {/* === Buttons === */}
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

export default ArticleEditPage;
