"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";

const TermsPage = () => {
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
                <FileText className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Terms of Service
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-6">Terms of Service</h2>

            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> December 2024
            </p>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                1. Acceptance of Terms
              </h3>
              <p className="text-gray-700 mb-4">
                By accessing and using K-YAYO ("the Service"), you accept and
                agree to be bound by the terms and provision of this agreement.
                If you do not agree to abide by the above, please do not use
                this service.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                2. Description of Service
              </h3>
              <p className="text-gray-700 mb-4">
                K-YAYO is a community platform that provides users with the
                ability to share and discuss Korean culture and entertainment
                content. The Service includes forums, blogs, and various
                interactive features.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">3. User Accounts</h3>
              <p className="text-gray-700 mb-4">
                You are responsible for maintaining the confidentiality of your
                account and password. You agree to accept responsibility for all
                activities that occur under your account or password.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">4. User Conduct</h3>
              <p className="text-gray-700 mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>
                  Post any content that is unlawful, harmful, threatening,
                  abusive, harassing, defamatory, vulgar, obscene, or otherwise
                  objectionable
                </li>
                <li>
                  Impersonate any person or entity or misrepresent your
                  affiliation with any person or entity
                </li>
                <li>
                  Upload, post, or transmit any content that infringes on any
                  patent, trademark, trade secret, copyright, or other
                  proprietary rights
                </li>
                <li>
                  Use the Service for any commercial purpose without our express
                  written consent
                </li>
                <li>
                  Attempt to gain unauthorized access to any portion of the
                  Service or any systems or networks
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                5. Content and Intellectual Property
              </h3>
              <p className="text-gray-700 mb-4">
                You retain ownership of any content you submit, post, or display
                on the Service. By submitting content, you grant us a worldwide,
                non-exclusive, royalty-free license to use, reproduce, modify,
                and distribute your content.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">6. Privacy Policy</h3>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Please review our Privacy
                Policy, which also governs your use of the Service, to
                understand our practices.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">7. Termination</h3>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account and bar access to the
                Service immediately, without prior notice or liability, under
                our sole discretion, for any reason whatsoever and without
                limitation, including but not limited to a breach of the Terms.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                8. Limitation of Liability
              </h3>
              <p className="text-gray-700 mb-4">
                In no event shall K-YAYO, nor its directors, employees,
                partners, agents, suppliers, or affiliates, be liable for any
                indirect, incidental, special, consequential, or punitive
                damages, including without limitation, loss of profits, data,
                use, goodwill, or other intangible losses.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">9. Governing Law</h3>
              <p className="text-gray-700 mb-4">
                These Terms shall be interpreted and governed by the laws of the
                Republic of Korea, without regard to its conflict of law
                provisions.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                10. Changes to Terms
              </h3>
              <p className="text-gray-700 mb-4">
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material, we
                will provide at least 30 days notice prior to any new terms
                taking effect.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                11. Contact Information
              </h3>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please
                contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> legal@k-yayo.com
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

export default TermsPage;
