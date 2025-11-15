"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Share2 } from "lucide-react";
import { isAdmin } from "@/app/utils/auth";

interface ArticleDetailPageProps {
  initialArticle: any;
}

const ArticleDetailPage = ({ initialArticle }: ArticleDetailPageProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const [article, setArticle] = useState(initialArticle);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [recentArticles, setRecentArticles] = useState([]);
  const [recentPodcasts, setRecentPodcasts] = useState([]);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: initialArticle.title || "",
    subTitle: initialArticle.subTitle || "",
    content: initialArticle.content || "",
    author: initialArticle.author || "",
    category: initialArticle.category || "",
    tags: Array.isArray(initialArticle.tags)
      ? initialArticle.tags.join(", ")
      : "",
  });

  const isUserAdmin = isAdmin(session);
  console.log('article: ', initialArticle)

  useEffect(() => {
    fetchRecentContent();
  }, []);

  const fetchRecentContent = async () => {
    try {
      // Fetch recent articles
      const articlesRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/article?limit=5&sort=-date`
      );
      if (articlesRes.ok) {
        const articlesData = await articlesRes.json();
        setRecentArticles(articlesData.articles || []);
      }

      // Fetch recent podcasts
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

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = article.title;

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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/article/${article._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("فشل في حذف المقال");
      }

      router.push("/article");
    } catch (err: any) {
      alert(err.message || "فشل في حذف المقال");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleUpdate = () => {
    router.push(`/article/edit/${article._id}`);
  };

  const handleStatusChange = async (
    newStatus: "draft" | "published" | "archived"
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/article/${article._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("فشل في تغيير حالة المقال");
      }

      const updatedArticle = await response.json();
      setArticle(updatedArticle);
      alert("تم تغيير حالة المقال بنجاح");
    } catch (err: any) {
      alert(err.message || "فشل في تغيير حالة المقال");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="flex flex-col items-center bg-secondary font-emirates overflow-x-hidden min-h-screen">
      <section className="w-screen flex flex-col h-[400px] overflow-y-hidden relative">
        <img
          src={article.thumbnail || "/images/article.jpg"}
          className="w-full h-full object-cover object-center"
          alt={article.title}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        <h1
          dir="rtl"
          className="font-bold text-4xl text-right absolute bottom-4 right-4 md:right-[3%] text-white z-10 max-w-[1100px] drop-shadow-lg px-4"
        >
          {article.title}
        </h1>
      </section>

      <div className="w-full max-w-[1400px] flex flex-col lg:flex-row-reverse gap-8 px-4 py-2">
        {/* Main Content */}
        <section className="flex-1 lg:flex px-8 pt-4 lg:flex-col w-full bg-secondary relative">
          <ArrowLeft
            className="text-primary -mb-12 cursor-pointer transition hover:opacity-70"
            onClick={() => router.back()}
          />
          <h2 dir="rtl" className="font-bold text-2xl my-6 pl-4 text-[#555]">{article.subTitle}</h2>

          {/* Share Button */}
          <div className="relative w-full lg:w-auto ml-auto inline-block mb-6">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex ml-auto items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg cursor-pointer transition"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة</span>
            </button>

            {showShareMenu && (
              <div dir="rtl" className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-20 min-w-[200px]">
                <button
                  onClick={() => handleShare("facebook")}
                  className="w-full flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition text-right"
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
                  className="w-full flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition text-right"
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
                  className="w-full flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition text-right"
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
                  className="w-full flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition text-right"
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

          {isUserAdmin && (
            <div
              dir="rtl"
              className="mb-6 p-4 bg-secondary rounded-lg border border-gray-300"
            >
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleUpdate()}
                  className="px-4 py-2 bg-gray-600 cursor-pointer text-white rounded-lg hover:opacity-80 transition"
                >
                  تعديل المقال
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 cursor-pointer text-white rounded-lg hover:bg-red-700 transition"
                >
                  حذف المقال
                </button>

                <div className="flex gap-2 mr-auto">
                  <span className="self-center text-sm ml-2">
                    حالة المقال:
                    {article.status === "published" && (
                      <span className="text-green-600 mr-2">منشور</span>
                    )}
                    {article.status === "draft" && (
                      <span className="text-yellow-600 mr-2">مسودة</span>
                    )}
                    {article.status === "archived" && (
                      <span className="text-gray-600 mr-2">مؤرشف</span>
                    )}
                  </span>
                  <span className="self-center text-sm text-gray-600 ml-2">
                    تغيير الحالة:
                  </span>
                  {article.status !== "draft" && (
                    <button
                      onClick={() => handleStatusChange("draft")}
                      className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 cursor-pointer transition text-sm"
                    >
                      مسودة
                    </button>
                  )}
                  {article.status !== "published" && (
                    <button
                      onClick={() => handleStatusChange("published")}
                      className="px-3 py-2 bg-green-600 text-white cursor-pointer rounded-lg hover:bg-green-500 transition text-sm"
                    >
                      نشر
                    </button>
                  )}
                  {article.status !== "archived" && (
                    <button
                      onClick={() => handleStatusChange("archived")}
                      className="px-3 py-2 bg-gray-100 text-gray-800 cursor-pointer rounded-lg hover:bg-gray-200 transition text-sm"
                    >
                      أرشفة
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div
            dir="rtl"
            className="flex flex-wrap gap-4 mb-6 text-gray-600 text-sm"
          >
            {article.author && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">الكاتب:</span>
                <span>{article.author}</span>
              </div>
            )}
            {article.date && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">التاريخ:</span>
                <span>{formatDate(article.date)}</span>
              </div>
            )}
          </div>

          {article.content && (
            <div
              dir="rtl"
              dangerouslySetInnerHTML={{ __html: article.content }}
              className="article-content leading-relaxed text-justifymb-6 text-gray-800"
            ></div>
          )}

          {article.category && (
            <div dir="rtl" className="mb-6">
              <span className="text-sm text-gray-600">التصنيف: </span>
              <span className="text-sm font-semibold text-gray-800">
                <a href={`/article?category=${article.category}`}>
                  {article.category}
                </a>
              </span>
            </div>
          )}

          {article.tags && article.tags.length > 0 && (
            <div dir="rtl" className="flex flex-wrap gap-2 mb-8">
              {article.tags.map((tag: string, index: number) => (
                <a href={`/article?tags=${tag}`} key={index}>
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition cursor-pointer">
                    {tag}
                  </span>
                </a>
              ))}
            </div>
          )}

          {article.status && article.status !== "published" && (
            <div dir="rtl" className="mt-8 pt-6 border-t border-gray-200">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  article.status === "draft"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {article.status === "draft" ? "مسودة" : "مؤرشف"}
              </span>
            </div>
          )}
        </section>

        {/* Sidebar */}
        <aside className="lg:w-80 space-y-6 mt-4">
          {/* Recent Articles */}
          <h3
            className="text-lg font-bold mb-4 text-right text-primary"
            dir="rtl"
          >
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

          {/* Recent Podcasts */}
          <h3
            className="text-lg font-bold mb-4 text-right text-primary"
            dir="rtl"
          >
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

      {/* Modals remain the same */}
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
              هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
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
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full my-8 relative z-10">
            <h3 className="text-xl font-bold mb-4 text-right" dir="rtl">
              تعديل المقال
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir="rtl">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  العنوان
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  الكاتب
                </label>
                <input
                  type="text"
                  value={editForm.author}
                  onChange={(e) =>
                    setEditForm({ ...editForm, author: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  التصنيف
                </label>
                <input
                  type="text"
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
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
                  المحتوى
                </label>
                <textarea
                  value={editForm.content}
                  onChange={(e) =>
                    setEditForm({ ...editForm, content: e.target.value })
                  }
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                disabled={isUpdating}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                إلغاء
              </button>
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="px-4 py-2 bg-primary text-white rounded-lg cursor-pointer transition disabled:opacity-50"
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

export default ArticleDetailPage;
