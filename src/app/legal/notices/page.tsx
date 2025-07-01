"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle } from "lucide-react";

const LegalNoticesPage = () => {
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
              <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center">
                <AlertTriangle className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Legal Notices</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-6">Legal Notices</h2>

            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> December 2024
            </p>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Copyright Notice</h3>
              <p className="text-gray-700 mb-4">
                © 2024 K-YAYO. All rights reserved. The content on this website,
                including but not limited to text, graphics, images, logos, and
                software, is the property of K-YAYO and is protected by
                copyright laws.
              </p>
              <p className="text-gray-700 mb-4">
                Users may not reproduce, distribute, or create derivative works
                from this content without express written permission from
                K-YAYO.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Trademark Notice</h3>
              <p className="text-gray-700 mb-4">
                K-YAYO and related trademarks, service marks, and logos are
                trademarks of K-YAYO. All other trademarks, service marks, and
                logos used on this website are the property of their respective
                owners.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                Disclaimer of Warranties
              </h3>
              <p className="text-gray-700 mb-4">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT
                NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS
                FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p className="text-gray-700 mb-4">
                K-YAYO does not warrant that the Service will be uninterrupted,
                secure, or error-free, or that defects will be corrected.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                Limitation of Liability
              </h3>
              <p className="text-gray-700 mb-4">
                IN NO EVENT SHALL K-YAYO BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT
                LIMITATION LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER
                INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE SERVICE.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                User-Generated Content
              </h3>
              <p className="text-gray-700 mb-4">
                Users are responsible for the content they post on the platform.
                K-YAYO does not endorse, support, or verify the accuracy of
                user-generated content. Users retain ownership of their content
                but grant K-YAYO a license to use, display, and distribute such
                content.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Third-Party Links</h3>
              <p className="text-gray-700 mb-4">
                The Service may contain links to third-party websites or
                services. K-YAYO is not responsible for the content, privacy
                policies, or practices of any third-party websites or services.
                Users access such links at their own risk.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">DMCA Notice</h3>
              <p className="text-gray-700 mb-4">
                If you believe that your copyrighted work has been copied in a
                way that constitutes copyright infringement, please provide our
                designated copyright agent with the following information:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>
                  A physical or electronic signature of the copyright owner
                </li>
                <li>
                  Identification of the copyrighted work claimed to have been
                  infringed
                </li>
                <li>
                  Identification of the material that is claimed to be
                  infringing
                </li>
                <li>Your contact information</li>
                <li>
                  A statement that you have a good faith belief that use of the
                  material is not authorized
                </li>
                <li>
                  A statement that the information is accurate and that you are
                  authorized to act on behalf of the copyright owner
                </li>
              </ul>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>DMCA Agent:</strong>
                  <br />
                  Email: dmca@k-yayo.com
                  <br />
                  Address: [Company Address]
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                Governing Law and Jurisdiction
              </h3>
              <p className="text-gray-700 mb-4">
                These legal notices shall be governed by and construed in
                accordance with the laws of the Republic of Korea. Any disputes
                arising from these notices shall be subject to the exclusive
                jurisdiction of the courts in Seoul, Korea.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Severability</h3>
              <p className="text-gray-700 mb-4">
                If any provision of these legal notices is found to be
                unenforceable or invalid, that provision will be limited or
                eliminated to the minimum extent necessary so that the remaining
                provisions will continue in full force and effect.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                Contact Information
              </h3>
              <p className="text-gray-700 mb-4">
                For questions about these legal notices, please contact us at:
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

export default LegalNoticesPage;
