"use client";

import { useState } from "react";
import { AlertCircle, Eye, EyeOff, User, Lock } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// const login = async (username: any, password: any) => {
//   const res = await fetch('http://127.0.0.1:3001/admin/login', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ username, password }),
//     cache: 'no-store'
//   });

//   if (!res.ok) throw new Error('Login failed');
//   return res.json();
// };

export default function LoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {} as any;

    if (!formData.username) {
      newErrors.username = "Username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
const handleSubmit = async (e: any) => {
  e.preventDefault();
  setGeneralError("");

  if (!validateForm()) return;

  setIsLoading(true);

  try {
    const result = await signIn("credentials", {
      username: formData.username,
      password: formData.password,
      redirect: false,
    });

    console.log("SignIn result:", result); // Debug

    if (result?.error) {
      // NextAuth returns "CredentialsSignin" as the error for failed auth
      if (result.error === "CredentialsSignin") {
        setGeneralError("Invalid username or password");
      } else {
        setGeneralError(result.error);
      }
      return;
    }

    if (result?.ok) {
      console.log("Login successful");
      router.push("/admin/dashboard");
    }
  } catch (err) {
    console.error("SignIn error:", err);
    setGeneralError("Unexpected error occurred");
  } finally {
    setIsLoading(false);
  }
};

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-secondary from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-black text-2xl font-bold">
            Sign In To Your Admin <br /> Dashboard
          </h1>
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
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
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
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`block w-full pl-10 pr-10 py-2.5 border ${
                  errors.password
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.password}
              </p>
            )}
            {errors.username && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.username}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-primary cursor-pointer text-white py-2.5 px-4 rounded-lg font-medium hover:bg-secondary hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
