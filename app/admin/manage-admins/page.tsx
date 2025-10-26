"use client";

import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  User,
  Lock,
  Trash2,
  UserPlus,
  Shield,
  Loader2,
} from "lucide-react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ManageAdminUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingAdmins, setIsFetchingAdmins] = useState(true);
  const [generalError, setGeneralError] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { data: session, status } = useSession();
  const router = useRouter();

  const [adminUsers, setAdminUsers] = useState<
    Array<{ id: string; username: string }>
  >([]);

  // Fetch admin users on component mount
  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      fetchAdminUsers();
    }
  }, [status, session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [session, status]);

  const fetchAdminUsers = async () => {
    setIsFetchingAdmins(true);
    try {
      const response = await fetch("http://localhost:3001/admin", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch admin users");
      }

      const data = await response.json();
      // Assuming the API returns an array of admins with _id and username
      const formattedAdmins = data.map((admin: any) => ({
        id: admin.id || admin._id,
        username: admin.username,
      }));
      setAdminUsers(formattedAdmins);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setGeneralError("Failed to load admin users");
    } finally {
      setIsFetchingAdmins(false);
    }
  };

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

  const handleSubmit = async () => {
    setIsLoading(true);
    setGeneralError("");
    setErrors({});

    // Validation
    const newErrors: { [key: string]: string } = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add admin user");
      }

      // Add new admin to list
      const newAdmin = {
        id: data.id || data._id,
        username: data.username,
      };
      setAdminUsers((prev) => [...prev, newAdmin]);

      alert("Admin user added successfully!");

      // Reset form
      setFormData({
        username: "",
        password: "",
      });
    } catch (error: any) {
      setGeneralError(error.message || "Failed to add admin user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, username: string) => {
    if (!confirm(`Are you sure you want to delete admin user "${username}"?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/admin/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete admin user");
      }

      // Remove admin from list
      setAdminUsers((prev) => prev.filter((admin) => admin.id !== id));
      alert("Admin user deleted successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to delete admin user. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-secondary from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-black text-3xl font-bold">Manage Admin Users</h1>
          <p className="text-gray-600 mt-2">
            Add new administrators and manage existing ones
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add New Admin Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <UserPlus className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-black">Add New Admin</h2>
            </div>

            {generalError && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{generalError}</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2.5 border ${
                      errors.username
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                    placeholder="admin@example.com"
                  />
                </div>
                {errors.username && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.username}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2.5 border ${
                      errors.password
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-primary cursor-pointer text-white py-2.5 px-4 rounded-lg font-medium hover:bg-secondary hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Adding Admin...
                  </>
                ) : (
                  "Add Admin User"
                )}
              </button>
            </div>
          </div>

          {/* Admin Users List */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-black">Current Admins</h2>
              <span className="ml-auto bg-primary text-white text-sm font-medium px-3 py-1 rounded-full">
                {adminUsers.length}
              </span>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {isFetchingAdmins ? (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 mx-auto mb-3 text-primary animate-spin" />
                  <p className="text-gray-500">Loading admin users...</p>
                </div>
              ) : adminUsers.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No admin users yet</p>
                </div>
              ) : (
                adminUsers.map((admin) => (
                  <div
                    key={admin.id}
                    className="bg-secondary border border-primary rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary p-2 rounded-full">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-black">
                          {admin.username}
                        </p>
                        <p className="text-sm text-gray-500">Administrator</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(admin.id, admin.username)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete admin"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAdminUsers;