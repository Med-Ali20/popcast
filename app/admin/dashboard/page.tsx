"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mic2,
  FileText,
  Users,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";

// This is the main dashboard page for the admin panel
// it will display routes to manage podcasts and articles
// as well as ability to add new admin users

const Dashboard = () => {
  const { data: session, status } = useSession();
  console.log("status: ", status);
  console.log(session);
  console.log("token: ", session?.accessToken);
  const router = useRouter();

  console.log("Dashboard render - Status:", status);
  console.log("Dashboard render - Session:", session);
  console.log("Dashboard render - Token:", session?.accessToken);

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e: any) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setMessage({ type: "", text: "" });
  };

  const handlePasswordSubmit = async () => {
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    // Validation
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setMessage({ type: "error", text: "All fields are required" });
      setIsLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "New password must be at least 6 characters",
      });
      setIsLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch("http://3.70.229.133:3001/admin/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.status === 200) {
        setMessage({ type: "success", text: "Password changed successfully!" });
      } else {
        setMessage({type: 'error', text: 'Failed to change password'})
      }

      console.log(response)

      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to change password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    console.log("tokennn: ", session?.accessToken);
  }, [session]);

  // ✅ Wait for session to load
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-600 mb-8">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Podcasts Card - Spans 2 columns */}
          <Link href="/admin/podcast" className="col-span-2">
            <div className="bg-secondary rounded-lg p-8 border border-primary hover:border-blue-500 transition-all duration-300 hover:scale-105 cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-lg bg-primary transition-colors">
                  <Mic2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-black mb-2">
                    Manage Podcasts
                  </h2>
                  <p className="text-gray-500">
                    Add, edit, and manage your podcast episodes
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Articles Card */}
          <Link href="/admin/articles">
            <div className="bg-secondary rounded-lg p-8 border border-primary hover:border-blue-500 transition-all duration-300 hover:scale-105 cursor-pointer group">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-4 rounded-lg bg-primary transition-colors">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-black mb-2">
                    Manage Articles
                  </h2>
                  <p className="text-gray-500">
                    Create and manage blog articles
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Users Card */}
          {session?.user.isSuperAdmin && (
            <Link href="/admin/manage-admins">
              <div className="bg-secondary rounded-lg p-8 border border-primary hover:border-blue-500 transition-all duration-300 hover:scale-105 cursor-pointer group">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-4 rounded-lg bg-primary transition-colors">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-black mb-2">
                      Manage Users
                    </h2>
                    <p className="text-gray-500">Add and manage admin users</p>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Change Password Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-black">
              Change Your Password
            </h2>
          </div>

          {message.text && (
            <div
              className={`mb-6 ${
                message.type === "error"
                  ? "bg-red-50 border-red-200"
                  : "bg-green-50 border-green-200"
              } border rounded-lg p-4 flex items-start gap-3`}
            >
              {message.type === "error" ? (
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              )}
              <p
                className={`text-sm ${
                  message.type === "error" ? "text-red-700" : "text-green-700"
                }`}
              >
                {message.text}
              </p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Current Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPasswords.current ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg focus:outline-none focus:ring-2 transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPasswords.new ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg focus:outline-none focus:ring-2 transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg focus:outline-none focus:ring-2 transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePasswordSubmit}
              disabled={isLoading}
              className="w-full bg-primary cursor-pointer text-white py-2.5 px-4 rounded-lg font-medium hover:bg-secondary hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Changing Password..." : "Change Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
