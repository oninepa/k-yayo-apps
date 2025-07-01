"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Coins,
  ShoppingCart,
  Package,
  Crown,
  Palette,
  Star,
} from "lucide-react";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "nickname" | "profile" | "badge" | "feature";
  icon: React.ReactNode;
  available: boolean;
}

const PointShopPage = () => {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const shopItems: ShopItem[] = [
    {
      id: "nickname-change",
      name: "Nickname Change",
      description: "Change your nickname (10 points)",
      price: 10,
      category: "nickname",
      icon: <Package className="w-6 h-6" />,
      available: true,
    },
    {
      id: "profile-background",
      name: "Profile Background",
      description: "Custom profile background color",
      price: 20,
      category: "profile",
      icon: <Palette className="w-6 h-6" />,
      available: true,
    },
    {
      id: "vip-badge",
      name: "VIP Badge",
      description: "Special VIP badge for your profile",
      price: 50,
      category: "badge",
      icon: <Crown className="w-6 h-6" />,
      available: true,
    },
    {
      id: "premium-feature",
      name: "Premium Feature",
      description: "Access to premium features",
      price: 100,
      category: "feature",
      icon: <Star className="w-6 h-6" />,
      available: true,
    },
  ];

  const categories = [
    { id: "all", name: "All Items" },
    { id: "nickname", name: "Nickname" },
    { id: "profile", name: "Profile" },
    { id: "badge", name: "Badges" },
    { id: "feature", name: "Features" },
  ];

  const filteredItems =
    selectedCategory === "all"
      ? shopItems
      : shopItems.filter((item) => item.category === selectedCategory);

  const handlePurchase = async (item: ShopItem) => {
    if (!user || !userData) {
      setMessage("Please login to purchase items.");
      return;
    }

    if (userData.points < item.price) {
      setMessage("Insufficient points for this purchase.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // TODO: Implement purchase logic
      // await purchaseItem(user.uid, item.id, item.price);
      setMessage("Purchase successful!");
    } catch (error) {
      console.error("Purchase failed:", error);
      setMessage("Purchase failed. Please try again.");
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
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Coins className="text-yellow-500" size={24} />
              <h1 className="text-2xl font-bold">Point Shop</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Coins className="text-yellow-500" size={20} />
              <span className="text-lg font-semibold">
                {userData?.points || 0} Points
              </span>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`p-4 mb-6 rounded-lg ${
              message.includes("successful")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Categories */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Shop Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-blue-600">{item.icon}</div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
              </div>

              <p className="text-gray-600 mb-4">{item.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Coins className="text-yellow-500" size={16} />
                  <span className="font-semibold">{item.price}</span>
                </div>

                <button
                  onClick={() => handlePurchase(item)}
                  disabled={
                    loading ||
                    !item.available ||
                    (userData?.points || 0) < item.price
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    (userData?.points || 0) < item.price
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Processing..." : "Purchase"}
                </button>
              </div>

              {!item.available && (
                <div className="mt-2 text-sm text-red-600">
                  Currently unavailable
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Recharge Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Need More Points?</h2>
              <p className="text-gray-600">
                Recharge your points to buy more items
              </p>
            </div>
            <button
              onClick={() => router.push("/points/recharge")}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Recharge Points
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointShopPage;
