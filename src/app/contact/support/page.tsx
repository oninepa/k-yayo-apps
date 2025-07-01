"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageSquare, Mail, Phone, Clock } from "lucide-react";

const SupportPage = () => {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const supportCategories = [
    { value: "technical", label: "Technical Issues" },
    { value: "account", label: "Account Problems" },
    { value: "billing", label: "Billing & Payments" },
    { value: "content", label: "Content & Moderation" },
    { value: "feature", label: "Feature Requests" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory || !subject || !message) {
      setSubmitMessage("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: 실제로는 이메일 서비스나 데이터베이스에 저장해야 함
      // await sendSupportEmail({
      //   category: selectedCategory,
      //   subject,
      //   message,
      //   userEmail: user?.email,
      //   userId: user?.uid
      // });

      setSubmitMessage(
        "Support request submitted successfully! We'll get back to you soon."
      );
      setSelectedCategory("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Failed to submit support request:", error);
      setSubmitMessage("Failed to submit support request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <MessageSquare className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Contact Support
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">
                Contact Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="text-blue-600" size={20} />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-gray-600">info@k-yayo.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="text-blue-600" size={20} />
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-gray-600">+33 6 0701 0336</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="text-blue-600" size={20} />
                  <div>
                    <p className="font-medium">Support Hours</p>
                    <p className="text-sm text-gray-600">
                      Mon-Fri: 9AM-6PM KST
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Before contacting support:
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Check our FAQ section</li>
                  <li>• Search for similar issues</li>
                  <li>• Include relevant details</li>
                  <li>• Provide screenshots if needed</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Support Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">
                Submit Support Request
              </h2>

              {/* Submit Message */}
              {submitMessage && (
                <div
                  className={`mb-4 p-4 rounded-lg ${
                    submitMessage.includes("successfully")
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                >
                  <p>{submitMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Category *
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    {supportCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief description of your issue"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please provide detailed information about your issue..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* User Information (if logged in) */}
                {user && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Your Information</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>Email:</strong> {user.email}
                      </p>
                      <p>
                        <strong>User ID:</strong> {user.uid}
                      </p>
                      {userData && (
                        <>
                          <p>
                            <strong>Nickname:</strong> {userData.nickname}
                          </p>
                          <p>
                            <strong>Member since:</strong>{" "}
                            {userData.createdAt?.toLocaleDateString()}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
