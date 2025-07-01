"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { updateUserProfile, changeNickname } from "@/services/userService";
import { User, Mail, MapPin, Phone, Calendar, UserCheck } from "lucide-react";

interface ProfileFormData {
  nickname: string;
  email: string;
  address: {
    country: string;
    city: string;
    postalCode: string;
  };
  phone: string;
  birthDate: string;
  gender: string;
}

const ProfileEditPage = () => {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [nicknameChanged, setNicknameChanged] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    nickname: "",
    email: "",
    address: {
      country: "",
      city: "",
      postalCode: "",
    },
    phone: "",
    birthDate: "",
    gender: "",
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        nickname: userData.nickname || "",
        email: user?.email || "",
        address: {
          country: userData.address?.country || "",
          city: userData.address?.city || "",
          postalCode: userData.address?.postalCode || "",
        },
        phone: userData.phone || "",
        birthDate: userData.birthDate || "",
        gender: userData.gender || "",
      });
      setNicknameChanged(userData.nicknameChangeCount > 0);
    }
  }, [userData, user]);

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof ProfileFormData] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage("");

    try {
      // 닉네임 변경 처리
      if (formData.nickname !== userData?.nickname) {
        if (nicknameChanged) {
          // 2회 이상 변경 시 포인트 차감
          if ((userData?.points || 0) < 10) {
            setMessage(
              "Insufficient points. You need 10 points to change nickname."
            );
            setLoading(false);
            return;
          }
        }

        await changeNickname(user.uid, formData.nickname);
      }

      // 프로필 업데이트
      await updateUserProfile(user.uid, {
        nickname: formData.nickname,
        address: formData.address,
        phone: formData.phone,
        birthDate: formData.birthDate,
        gender: formData.gender,
      });

      setMessage("Profile updated successfully!");
      setNicknameChanged(true);
    } catch (error) {
      console.error("Profile update failed:", error);
      setMessage("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
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
            <User className="text-blue-600" size={24} />
            <h1 className="text-2xl font-bold">Edit Profile</h1>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nickname */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nickname
                {nicknameChanged && (
                  <span className="text-red-500 ml-2">
                    (10 points required)
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) =>
                    handleInputChange("nickname", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your nickname"
                  required
                />
                <UserCheck
                  className="absolute right-3 top-2.5 text-gray-400"
                  size={20}
                />
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
                <Mail
                  className="absolute right-3 top-2.5 text-gray-400"
                  size={20}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>

            {/* Address */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.address.country}
                    onChange={(e) =>
                      handleInputChange("address.country", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Country"
                  />
                  <MapPin
                    className="absolute right-3 top-2.5 text-gray-400"
                    size={20}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) =>
                    handleInputChange("address.city", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.address.postalCode}
                  onChange={(e) =>
                    handleInputChange("address.postalCode", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Postal Code"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Phone number"
                />
                <Phone
                  className="absolute right-3 top-2.5 text-gray-400"
                  size={20}
                />
              </div>
            </div>

            {/* Birth Date and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birth Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) =>
                      handleInputChange("birthDate", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Calendar
                    className="absolute right-3 top-2.5 text-gray-400"
                    size={20}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;
