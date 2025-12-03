"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Upload, X, LoaderCircle } from "lucide-react";
import { isAdmin } from "@/app/utils/auth";
import { Editor } from "@tinymce/tinymce-react";

const ArticleEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const { slug } = params;
  const { data: session, status } = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [uploadingMedia, setUploadingMedia] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
    content: "",
    author: "",
    category: "",
    tags: "",
    thumbnail: "",
  });

  const editorRef = useRef<any>(null);

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
        subTitle: article.subTitle || "",
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

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview("");
    setFormData((prev) => ({ ...prev, thumbnail: "" }));
  };

  // Custom upload handler for images and videos in TinyMCE
  const handleImageUpload = (blobInfo: any, progress: any) => {
    return new Promise<string>(async (resolve, reject) => {
      setUploadingMedia(true);

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

  const handleSubmit = async () => {
    setIsUpdating(true);

    try {
      let thumbnailUrl = formData.thumbnail;

      // Upload new thumbnail if one is selected
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
        subTitle: formData.subTitle,
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
      <div className="fixed top-0 right-0 bottom-0 left-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-5000" style={{ display: uploadingMedia ? 'flex' : 'none' }}>
        <LoaderCircle className="w-16 h-16 text-white animate-spin z-5000" tabIndex={-1} />
      </div>

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
            <div className="md:col-span-2">
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

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">
                العنوان الفرعي
              </label>
              <input
                type="text"
                value={formData.subTitle}
                onChange={(e) =>
                  setFormData({ ...formData, subTitle: e.target.value })
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

            {/* TinyMCE Rich text editor */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">
                المحتوى *
              </label>

              {uploadingMedia && (
                <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <p className="text-sm text-blue-700">
                    Uploading media to S3...
                  </p>
                </div>
              )}

              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  value={formData.content}
                  onEditorChange={(content) => {
                    setFormData((prev) => ({ ...prev, content }));
                  }}
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

                    images_upload_url: "postAcceptor.php",
                    images_upload_base_path: "",
                    images_upload_credentials: true,

                    image_advtab: true,
                    image_caption: true,
                    image_title: true,

                    object_resizing: true,
                    resize_img_proportional: true,

                    media_live_embeds: true,
                    media_dimensions: true,
                    media_poster: false,
                    media_alt_source: false,

                    file_picker_types: "image media",
                    // @ts-ignore
                    file_picker_callback: function (callback, value, meta) {
                      const input = document.createElement("input");
                      input.setAttribute("type", "file");

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

                    paste_data_images: true,

                    quickbars_selection_toolbar:
                      "bold italic | quicklink h2 h3 blockquote",
                    quickbars_insert_toolbar: "quickimage quicktable",

                    contextmenu: "link image table",

                    table_responsive_width: true,
                    table_default_attributes: {
                      border: "1",
                    },

                    link_default_target: "_blank",
                    link_assume_external_targets: true,
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Use the toolbar to format text, upload images and videos. Drag &
                drop or paste images directly.
              </p>
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

export default ArticleEditPage;