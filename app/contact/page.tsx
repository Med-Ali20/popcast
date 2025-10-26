"use client";

import React, { useState } from "react";
import {
  Mail,
  Send,
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  MapPin,
} from "lucide-react";

const ContactPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "الاسم مطلوب";
    }

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صالح";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "الموضوع مطلوب";
    }

    if (!formData.message.trim()) {
      newErrors.message = "الرسالة مطلوبة";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "الرسالة يجب أن تكون 10 أحرف على الأقل";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("تم إرسال رسالتك بنجاح! سنتواصل معك قريبًا.");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setErrorMessage(data.error || "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      console.error('Submit error:', error);
      setErrorMessage("حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="relative bg-primary text-white py-20 px-4">
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6" dir="rtl">
            تواصل معنا
          </h1>
          <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12" dir="rtl">
          <p className="text-lg leading-relaxed text-gray-700 mb-6 text-right">
            يُنتج بودكاست <span className="font-bold text-primary">PopCast</span> من قبل استوديو{" "}
            <span className="font-bold">BxB للإنتاج</span>، وهو الفريق الإبداعي نفسه
            وراء منصة <span className="font-bold">ArabiaPop</span> التي توثق تطوّر
            البوب العربي وتحفظ أرشيفه عبر الأجيال.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 mb-6 text-right">
            بينما تحتفي <span className="font-bold">ArabiaPop</span> بالإرث الثقافي،
            يمنح <span className="font-bold text-primary">PopCast</span> صوتًا
            للقصص الإنسانية والخلفيات العاطفية التي شكّلت الموسيقى والإعلام
            والذاكرة في العالم العربي.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 text-right">
            إذا كنت مستمعًا، فنانًا، شريكًا إعلاميًا، أو مهتمًا بالتعاون – يسعدنا
            تواصلك معنا.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-primary">
              <div className="flex items-center justify-center w-14 h-14 bg-indigo-50 rounded-full mb-4 mx-auto">
                <Mail className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-center font-bold text-gray-800 mb-2" dir="rtl">
                البريد الإلكتروني
              </h3>
              <a
                href="mailto:info@itspopcast.com"
                className="block text-center text-primary hover:opacity-80 transition-colors font-medium"
              >
                info@itspopcast.com
              </a>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-primary">
              <div className="flex items-center justify-center w-14 h-14 bg-indigo-50 rounded-full mb-4 mx-auto">
                <MapPin className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-center font-bold text-gray-800 mb-2" dir="rtl">
                الموقع
              </h3>
              <p className="text-center text-gray-600" dir="rtl">
                صُنع بجرأة في
                <br />
                المملكة العربية السعودية 🇸🇦
              </p>
            </div>

            <div className="bg-primary rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-center font-bold text-lg mb-3" dir="rtl">
                نحن هنا لمساعدتك
              </h3>
              <p className="text-center text-sm opacity-90" dir="rtl">
                سواء كان لديك سؤال، اقتراح، أو تريد التعاون معنا - نحن متحمسون
                للاستماع إليك!
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">

              {successMessage && (
                <div
                  className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3"
                  dir="rtl"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
              )}

              {errorMessage && (
                <div
                  className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
                  dir="rtl"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              )}

              <div className="space-y-6">
                <div dir="rtl">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2 text-right"
                  >
                    الاسم *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`block w-full pr-10 pl-3 py-3 border ${
                        errors.name
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-primary focus:border-primary"
                      } rounded-lg focus:outline-none focus:ring-2 transition-colors text-right`}
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1 justify-end">
                      <span>{errors.name}</span>
                      <AlertCircle className="w-4 h-4" />
                    </p>
                  )}
                </div>

                <div dir="rtl">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2 text-right"
                  >
                    البريد الإلكتروني *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full pr-10 pl-3 py-3 border ${
                        errors.email
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-primary focus:border-primary"
                      } rounded-lg focus:outline-none focus:ring-2 transition-colors text-right`}
                      placeholder="example@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1 justify-end">
                      <span>{errors.email}</span>
                      <AlertCircle className="w-4 h-4" />
                    </p>
                  )}
                </div>

                <div dir="rtl">
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2 text-right"
                  >
                    الموضوع *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`block w-full px-3 py-3 border ${
                      errors.subject
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-primary focus:border-primary"
                    } rounded-lg focus:outline-none focus:ring-2 transition-colors text-right`}
                    placeholder="موضوع الرسالة"
                  />
                  {errors.subject && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1 justify-end">
                      <span>{errors.subject}</span>
                      <AlertCircle className="w-4 h-4" />
                    </p>
                  )}
                </div>

                <div dir="rtl">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2 text-right"
                  >
                    الرسالة *
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 right-3 pointer-events-none">
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className={`block w-full pr-10 pl-3 py-3 border ${
                        errors.message
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-primary focus:border-primary"
                      } rounded-lg focus:outline-none focus:ring-2 transition-colors text-right`}
                      placeholder="اكتب رسالتك هنا..."
                    />
                  </div>
                  {errors.message && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1 justify-end">
                      <span>{errors.message}</span>
                      <AlertCircle className="w-4 h-4" />
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>جاري الإرسال...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>إرسال الرسالة</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;