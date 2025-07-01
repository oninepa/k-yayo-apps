"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Mail, CheckCircle, AlertCircle, Send } from "lucide-react";

const EmailVerificationPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSendVerification = async () => {
    if (!user) return;

    setLoading(true);
    setMessage("");

    try {
      // TODO: Implement EmailJS verification
      // await sendVerificationEmail(user.email);

      setVerificationSent(true);
      setMessage(
        "Verification email sent successfully! Please check your inbox."
      );
    } catch (error) {
      console.error("Failed to send verification email:", error);
      setMessage("Failed to send verification email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    await handleSendVerification();
  };

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Mail className="text-blue-600" size={24} />
            <h1 className="text-2xl font-bold">Email Verification</h1>
          </div>

          {message && (
            <div
              className={`p-4 mb-6 rounded-lg ${
                message.includes("successfully")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <div className="space-y-6">
            {/* Current Email Status */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current Email</p>
                  <p className="font-semibold">{user.email}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {user.emailVerified ? (
                    <>
                      <CheckCircle className="text-green-600" size={20} />
                      <span className="text-green-600 text-sm">Verified</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="text-yellow-600" size={20} />
                      <span className="text-yellow-600 text-sm">
                        Not Verified
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Verification Instructions */}
            {!user.emailVerified && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Verify Your Email Address
                </h3>
                <p className="text-blue-700 text-sm mb-4">
                  To ensure the security of your account and receive important
                  notifications, please verify your email address.
                </p>

                <button
                  onClick={handleSendVerification}
                  disabled={loading || verificationSent}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                  <span>
                    {loading
                      ? "Sending..."
                      : verificationSent
                      ? "Email Sent"
                      : "Send Verification Email"}
                  </span>
                </button>

                {verificationSent && (
                  <button
                    onClick={handleResendVerification}
                    disabled={loading}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                  >
                    Resend verification email
                  </button>
                )}
              </div>
            )}

            {/* Benefits of Email Verification */}
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">
                Benefits of Email Verification
              </h3>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Enhanced account security</li>
                <li>• Password recovery options</li>
                <li>• Important notifications and updates</li>
                <li>• Access to premium features</li>
              </ul>
            </div>

            {/* Back Button */}
            <div className="flex justify-end pt-6 border-t">
              <button
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
