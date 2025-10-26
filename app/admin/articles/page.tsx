"use client";

import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  BookOpen,
  Tag,
  FolderOpen,
  User,
  CheckCircle,
  FileText,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FormData {
  title: string;
  content: string;
  author: string;
  category: string;
  tags: string;
  status: "draft" | "published" | "archived";
  date: string;
}

interface Errors {
  [key: string]: string;
}

const ArticleUpload: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    author: "",
    category: "",
    tags: "",
    status: "draft",
    date: new Date().toISOString().slice(0, 16),
  });

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [session, status, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleThumbnailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          thumbnail: "Please select a valid image file",
        }));
        return;
      }
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, thumbnail: "" }));
    }
  };

  const handleSubmit = async (): Promise<void> => {
    setIsLoading(true);
    setGeneralError("");
    setSuccessMessage("");
    setErrors({});

    const newErrors: Errors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (formData.status === "published" && !formData.date) {
      newErrors.date = "Publication date is required for published articles";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const data = new FormData();

      data.append("title", formData.title.trim());
      data.append("content", formData.content.trim());
      data.append("author", formData.author.trim());
      data.append("category", formData.category.trim());
      data.append("tags", formData.tags);
      data.append("status", formData.status);
      data.append("date", new Date(formData.date).toISOString());

      if (thumbnailFile) {
        data.append("thumbnail", thumbnailFile);
      }

      const response = await fetch("http://3.70.229.133:3001/article", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create article");
      }

      const result = await response.json();
      console.log("Article created:", result);

      setSuccessMessage(
        `Article ${
          formData.status === "published" ? "published" : "saved as draft"
        } successfully!`
      );

      setFormData({
        title: "",
        content: "",
        author: "",
        category: "",
        tags: "",
        status: "draft",
        date: new Date().toISOString().slice(0, 16),
      });
      setThumbnailFile(null);
      setThumbnailPreview("");

      const thumbnailInput = document.getElementById(
        "thumbnail"
      ) as HTMLInputElement;
      if (thumbnailInput) thumbnailInput.value = "";
    } catch (error: any) {
      console.error("Submit error:", error);
      setGeneralError(
        error.message || "Failed to create article. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-gray-900 text-2xl font-bold">
            Create New Article
          </h1>
          <p className="text-gray-600 mt-2">Write and publish your article</p>
        </div>

        {generalError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{generalError}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2.5 border ${
                  errors.title
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                placeholder="Enter article title"
              />
            </div>
            {errors.title && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={12}
              className={`block w-full px-3 py-2.5 border ${
                errors.content
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
              placeholder="Write your article content here..."
            />
            {errors.content && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.content}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="author"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Author
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Author name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FolderOpen className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Enter category"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="thumbnail"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Thumbnail Image
            </label>
            <div className="relative">
              <input
                type="file"
                id="thumbnail"
                name="thumbnail"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white file:cursor-pointer border border-gray-300 rounded-lg"
              />
            </div>
            {thumbnailFile && (
              <div className="mt-3">
                <p className="text-xs text-green-600 flex items-center gap-1 mb-2">
                  <CheckCircle className="w-3 h-3" />
                  {thumbnailFile.name} ({(thumbnailFile.size / 1024).toFixed(2)}{" "}
                  KB)
                </p>
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-full max-w-xs h-48 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}
            {errors.thumbnail && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.thumbnail}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tags
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="tag1, tag2, tag3"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Separate tags with commas
            </p>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Choose "Published" to make the article visible to readers
            </p>
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Publication Date {formData.status === "published" && "*"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2.5 border ${
                  errors.date
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
              />
            </div>
            {errors.date && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.date}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.status === "published"
                ? "Schedule when this article will be published (default is immediately)."
                : "Optional. Set a future date to schedule publication."}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 bg-primary cursor-pointer text-white py-2.5 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Creating..."
                : formData.status === "published"
                ? "Publish Article"
                : "Save Article"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleUpload;