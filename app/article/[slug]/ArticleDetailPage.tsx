'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft } from "lucide-react";
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

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: initialArticle.title || "",
    content: initialArticle.content || "",
    author: initialArticle.author || "",
    category: initialArticle.category || "",
    tags: Array.isArray(initialArticle.tags) ? initialArticle.tags.join(", ") : "",
  });

  const isUserAdmin = isAdmin(session);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `http://3.70.229.133:3001/article/${article._id}`,
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

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const updateData: any = {
        title: editForm.title,
        content: editForm.content,
        author: editForm.author,
        category: editForm.category,
      };

      if (editForm.tags.trim()) {
        updateData.tags = editForm.tags.split(",").map((tag: any) => tag.trim());
      }

      const response = await fetch(
        `http://3.70.229.133:3001/article/${article._id}`,
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

      const updatedArticle = await response.json();
      setArticle(updatedArticle);
      setShowEditModal(false);
      alert("تم تحديث المقال بنجاح");
    } catch (err: any) {
      alert(err.message || "فشل في تحديث المقال");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async (
    newStatus: "draft" | "published" | "archived"
  ) => {
    try {
      const response = await fetch(
        `http://3.70.229.133:3001/article/${article._id}/status`,
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
    <main className="flex flex-col items-center bg-secondary font-emirates min-h-screen">
      <section className="w-screen flex flex-col h-[400px] overflow-y-hidden relative">
        <img
          src={article.thumbnail || "/images/article.jpg"}
          className="w-full h-full object-cover object-center"
          alt={article.title}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        <h1
          dir="rtl"
          className="font-bold text-4xl text-right absolute bottom-4 right-[13%] text-white z-10 max-w-[1100px] drop-shadow-lg"
        >
          {article.title}
        </h1>
      </section>

      <section className="bg-secondary w-full relative py-8 max-w-[1100px] px-4">
        <ArrowLeft
          className="text-primary absolute left-4 lg:-left-[10%] top-[10%] cursor-pointer"
          onClick={() => router.back()}
        />

        {isUserAdmin && (
          <div
            dir="rtl"
            className="mb-6 p-4 bg-secondary rounded-lg border border-gray-300"
          >
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowEditModal(true)}
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

        {article.category && (
          <div dir="rtl" className="mb-6">
            <span className="text-sm text-gray-600">التصنيف: </span>
            <span className="text-sm font-semibold text-gray-800">
              {article.category}
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

        {article.content && (
          <article
            dir="rtl"
            className="text-right text-lg leading-relaxed text-gray-800 prose prose-lg max-w-none"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {article.content}
          </article>
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
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