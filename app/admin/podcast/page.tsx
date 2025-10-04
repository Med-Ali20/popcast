"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  Mic2,
  Tag,
  FolderOpen,
  Upload,
  Youtube,
  Music,
  CheckCircle,
} from "lucide-react";

const PodcastUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ audio: 0, video: 0 });
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtube: "",
    spotify: "",
    anghami: "",
    appleMusic: "",
    tags: "",
    category: "",
    thumbnailUrl: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "audio" | "video"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "audio") {
        // Validate audio file
        if (!file.type.startsWith("audio/")) {
          setErrors((prev) => ({
            ...prev,
            audio: "Please select a valid audio file",
          }));
          return;
        }
        setAudioFile(file);
        setErrors((prev) => ({ ...prev, audio: "" }));
      } else {
        // Validate video file
        if (!file.type.startsWith("video/")) {
          setErrors((prev) => ({
            ...prev,
            video: "Please select a valid video file",
          }));
          return;
        }
        setVideoFile(file);
        setErrors((prev) => ({ ...prev, video: "" }));
      }
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setGeneralError("");
    setSuccessMessage("");
    setErrors({});

    // Basic validation
    if (!formData.title.trim()) {
      setErrors({ title: "Title is required" });
      setIsLoading(false);
      return;
    }

    if (!audioFile && !videoFile) {
      setGeneralError("Please upload at least one audio or video file");
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData for multipart/form-data
      const data = new FormData();

      // Add text fields
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("youtube", formData.youtube);
      data.append("spotify", formData.spotify);
      data.append("anghami", formData.anghami);
      data.append("appleMusic", formData.appleMusic);
      data.append("category", formData.category);
      data.append("tags", formData.tags);
      data.append("thumbnailUrl", formData.thumbnailUrl);

      // Add files
      if (audioFile) {
        data.append("audio", audioFile);
      }
      if (videoFile) {
        data.append("video", videoFile);
      }

      // Upload to backend
      const response = await fetch("http://localhost:3001/podcast", {
        method: "POST",
        body: data,
        // Don't set Content-Type header - browser will set it with boundary for FormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload podcast");
      }

      const result = await response.json();
      console.log("Podcast uploaded:", result);

      setSuccessMessage("Podcast uploaded successfully!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        youtube: "",
        spotify: "",
        anghami: "",
        appleMusic: "",
        tags: "",
        category: "",
        thumbnailUrl: "",
      });
      setAudioFile(null);
      setVideoFile(null);

      // Reset file inputs
      const audioInput = document.getElementById("audio") as HTMLInputElement;
      const videoInput = document.getElementById("video") as HTMLInputElement;
      if (audioInput) audioInput.value = "";
      if (videoInput) videoInput.value = "";
    } catch (error: any) {
      console.error("Upload error:", error);
      setGeneralError(
        error.message || "Failed to upload podcast. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Mic2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-black text-2xl font-bold">Upload New Podcast</h1>
          <p className="text-gray-600 mt-2">
            Fill in the details to add a new podcast episode
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
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mic2 className="h-5 w-5 text-gray-400" />
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
                placeholder="Enter podcast title"
              />
            </div>
            {errors.title && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter podcast description"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="thumbnail"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Thumbnail URL
            </label>
            <input
              type="text"
              id="thumbnail"
              name="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter podcast thumbnail URL"
            />
          </div>

          {/* Audio and Video File Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="audio"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Audio File
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="audio"
                  name="audio"
                  accept="audio/*"
                  onChange={(e) => handleFileChange(e, "audio")}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-90 file:cursor-pointer border border-gray-300 rounded-lg"
                />
              </div>
              {audioFile && (
                <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)}{" "}
                  MB)
                </p>
              )}
              {errors.audio && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.audio}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="video"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Video File
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="video"
                  name="video"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, "video")}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-90 file:cursor-pointer border border-gray-300 rounded-lg"
                />
              </div>
              {videoFile && (
                <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)}{" "}
                  MB)
                </p>
              )}
              {errors.video && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.video}
                </p>
              )}
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">
              Platform Links
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="youtube"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  YouTube
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Youtube className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="youtube"
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="YouTube URL"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="spotify"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Spotify
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Music className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="spotify"
                    name="spotify"
                    value={formData.spotify}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Spotify URL"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="anghami"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Anghami
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Music className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="anghami"
                    name="anghami"
                    value={formData.anghami}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Anghami URL"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="appleMusic"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Apple Music
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Music className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="appleMusic"
                    name="appleMusic"
                    value={formData.appleMusic}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Apple Music URL"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-primary cursor-pointer text-white py-2.5 px-4 rounded-lg font-medium hover:bg-secondary hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Uploading to S3..." : "Upload Podcast"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PodcastUpload;
