"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  AlertCircle,
  BookOpen,
  Tag,
  FolderOpen,
  User,
  CheckCircle,
  FileText,
  Calendar,
  LoaderCircle
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Editor } from "@tinymce/tinymce-react";

interface FormData {
  title: string;
  subTitle: string;
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
  const [uploadingMedia, setUploadingMedia] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    subTitle: "",
    content: "",
    author: "",
    category: "",
    tags: "",
    status: "draft",
    date: new Date().toISOString().slice(0, 16),
  });

  const editorRef = useRef<any>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [session, status, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content: content,
    }));
    if (errors.content) {
      setErrors((prev) => ({
        ...prev,
        content: "",
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

  // Custom upload handler for images and videos
  const handleImageUpload = (blobInfo: any, progress: any) => {
    return new Promise<string>(async (resolve, reject) => {
      setUploadingMedia(true);

      // Show notification in TinyMCE
      if (editorRef.current) {
        editorRef.current.notificationManager.open({
          text: "Uploading image to S3...",
          type: "info",
          timeout: -1,
          closeButton: false,
        });
      }

      const formData = new FormData();
      formData.append("media", blobInfo.blob(), blobInfo.filename());

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/article/upload-media`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          alert("Upload failed, please try to login again.");
          throw new Error("Upload failed");
        }

        const data = await response.json();

        // Close notification and show success
        if (editorRef.current) {
          editorRef.current.notificationManager.close();
          editorRef.current.notificationManager.open({
            text: "Upload successful!",
            type: "success",
            timeout: 2000,
          });
        }

        resolve(data.url);
      } catch (error: any) {
        // Show error notification
        if (editorRef.current) {
          editorRef.current.notificationManager.close();
          editorRef.current.notificationManager.open({
            text: "Upload failed: " + (error.message || "Unknown error"),
            type: "error",
            timeout: 3000,
          });
        }
        reject(error.message || "Upload failed");
      } finally {
        setUploadingMedia(false);
      }
    });
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

    // Check if content is empty
    const strippedContent = formData.content
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, "")
      .trim();
    if (!strippedContent) {
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
      data.append("subTitle", formData.subTitle.trim());
      data.append("content", formData.content);
      data.append("author", formData.author.trim());
      data.append("category", formData.category.trim());
      data.append("tags", formData.tags);
      data.append("status", formData.status);
      data.append("date", new Date(formData.date).toISOString());

      if (thumbnailFile) {
        data.append("thumbnail", thumbnailFile);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/article`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: data,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create article");
      }

      const result = await response.json();

      setSuccessMessage(
        `Article ${
          formData.status === "published" ? "published" : "saved as draft"
        } successfully!`
      );

      // Reset form
      setFormData({
        title: "",
        subTitle: "",
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

      // Reset editor
      if (editorRef.current) {
        editorRef.current.setContent("");
      }
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
      <div className="fixed top-0 right-0 bottom-0 left-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-5000" style={{ display: uploadingMedia ? 'flex' : 'none' }}>
        <LoaderCircle className="w-16 h-16 text-white animate-spin z-5000" tabIndex={-1} />
      </div>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-gray-900 text-2xl font-bold">
            Create New Article
          </h1>
          <p className="text-gray-600 mt-2">
            Write and publish your article with rich content
          </p>
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
              htmlFor="subTitle"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Sub-Title
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="subTitle"
                name="subTitle"
                value={formData.subTitle}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg focus:outline-none focus:ring-2 transition-colors"
                placeholder="Enter article sub-title"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>

            {uploadingMedia && (
              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <p className="text-sm text-blue-700">
                  Uploading media to S3...
                </p>
              </div>
            )}

            <div
              className={`border ${
                errors.content ? "border-red-300" : "border-gray-300"
              } rounded-lg overflow-hidden`}
            >
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                onInit={(evt, editor) => (editorRef.current = editor)}
                value={formData.content}
                onEditorChange={handleEditorChange}
                init={{
                  height: 500,
                  menubar: true,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                    "emoticons",
                    "codesample",
                    "quickbars",
                  ],
                  toolbar:
                    "undo redo | blocks | " +
                    "bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "image media link | table codesample | " +
                    "removeformat code | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",

                  // Image upload configuration
                  images_upload_handler: handleImageUpload,
                  automatic_uploads: true,
                  images_reuse_filename: true,

                  // Show upload progress
                  images_upload_url: "postAcceptor.php",
                  images_upload_base_path: "",
                  images_upload_credentials: true,

                  // Image resizing
                  image_advtab: true,
                  image_caption: true,
                  image_title: true,

                  // Allow resizing of images
                  object_resizing: true,
                  resize_img_proportional: true,

                  // Media/Video configuration
                  media_live_embeds: true,
                  media_dimensions: true,
                  media_poster: false,
                  media_alt_source: false,

                  // Video upload handler (for local video files)
                  file_picker_types: "image media",
                  // @ts-ignore
                  file_picker_callback: function (callback, value, meta) {
                    // Create file input
                    const input = document.createElement("input");
                    input.setAttribute("type", "file");

                    // Set accept based on filetype
                    if (meta.filetype === "image") {
                      input.setAttribute("accept", "image/*");
                    } else if (meta.filetype === "media") {
                      input.setAttribute("accept", "video/*");
                    }

                    input.onchange = async function () {
                      const file = (input as HTMLInputElement).files?.[0];
                      if (file) {
                        const uploadFormData = new FormData();
                        uploadFormData.append("media", file);

                        try {
                          setUploadingMedia(true);

                          const response = await fetch(
                            `${process.env.NEXT_PUBLIC_API_URL}/article/upload-media`,
                            {
                              method: "POST",
                              headers: {
                                Authorization: `Bearer ${session?.accessToken}`,
                              },
                              body: uploadFormData,
                            }
                          );

                          if (response.ok) {
                            const data = await response.json();
                            callback(data.url, { title: file.name });
                            setUploadingMedia(false);
                          } else {
                            alert("Upload failed, please try to login again.");
                            setUploadingMedia(false);
                            console.error("Upload failed");
                          }
                        } catch (error) {
                          console.error("Upload failed:", error);
                        }
                      }
                    };

                    input.click();
                  },

                  // Paste configuration
                  paste_data_images: true,

                  // Quick toolbars
                  quickbars_selection_toolbar:
                    "bold italic | quicklink h2 h3 blockquote",
                  quickbars_insert_toolbar: "quickimage quicktable",

                  // Context menu
                  contextmenu: "link image table",

                  // Table settings
                  table_responsive_width: true,
                  table_default_attributes: {
                    border: "1",
                  },

                  // Link settings
                  link_default_target: "_blank",
                  link_assume_external_targets: true,
                }}
              />
            </div>

            {errors.content && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.content}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Use the toolbar to format text, upload images and videos. Drag &
              drop or paste images directly. Click "Insert/Edit Image" or
              "Insert/Edit Media" buttons to upload files. All uploads go to S3.
              Images and videos are resizable.
            </p>
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
            <input
              type="file"
              id="thumbnail"
              name="thumbnail"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white file:cursor-pointer cursor-pointer border border-gray-300 rounded-lg"
            />
            {thumbnailPreview && (
              <div className="mt-3">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg cursor-pointer font-medium hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Processing..."
              : formData.status === "published"
              ? "Publish Article"
              : "Save Article"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleUpload;
