"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield } from "lucide-react";

const PrivacyPage = () => {
  const router = useRouter();

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
                <Shield className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Privacy Policy
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-6">Privacy Policy</h2>

            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> December 2024
            </p>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                1. Information We Collect
              </h3>
              <p className="text-gray-700 mb-4">
                We collect information you provide directly to us, such as when
                you create an account, post content, or contact us for support.
              </p>
              <h4 className="text-lg font-medium mb-2">
                Personal Information:
              </h4>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Email address</li>
                <li>Nickname or display name</li>
                <li>Profile information</li>
                <li>Content you post or upload</li>
              </ul>
              <h4 className="text-lg font-medium mb-2">Usage Information:</h4>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Pages you visit</li>
                <li>Features you use</li>
                <li>Time spent on the platform</li>
                <li>Device and browser information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                2. How We Use Your Information
              </h3>
              <p className="text-gray-700 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and manage your account</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze trends and usage</li>
                <li>
                  Detect, investigate, and prevent fraudulent transactions and
                  other illegal activities
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                3. Information Sharing
              </h3>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or otherwise transfer your personal
                information to third parties without your consent, except in the
                following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>In connection with a business transfer or merger</li>
                <li>With service providers who assist in our operations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">4. Data Security</h3>
              <p className="text-gray-700 mb-4">
                We implement appropriate security measures to protect your
                personal information against unauthorized access, alteration,
                disclosure, or destruction. However, no method of transmission
                over the internet or electronic storage is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                5. Cookies and Tracking
              </h3>
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to enhance your
                experience on our platform. You can control cookie settings
                through your browser preferences.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">6. Your Rights</h3>
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Object to processing of your information</li>
                <li>Request data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">7. Data Retention</h3>
              <p className="text-gray-700 mb-4">
                We retain your personal information for as long as necessary to
                provide our services and fulfill the purposes outlined in this
                policy. When you delete your account, we will delete or
                anonymize your personal information.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                8. Children's Privacy
              </h3>
              <p className="text-gray-700 mb-4">
                Our service is not intended for children under 13 years of age.
                We do not knowingly collect personal information from children
                under 13. If you are a parent or guardian and believe your child
                has provided us with personal information, please contact us.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                9. International Transfers
              </h3>
              <p className="text-gray-700 mb-4">
                Your information may be transferred to and processed in
                countries other than your own. We ensure that such transfers
                comply with applicable data protection laws.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                10. Changes to This Policy
              </h3>
              <p className="text-gray-700 mb-4">
                We may update this privacy policy from time to time. We will
                notify you of any changes by posting the new policy on this page
                and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">11. Contact Us</h3>
              <p className="text-gray-700 mb-4">
                If you have any questions about this privacy policy, please
                contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@k-yayo.com
                  <br />
                  <strong>Address:</strong> [Company Address]
                  <br />
                  <strong>Phone:</strong> +82-2-1234-5678
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
