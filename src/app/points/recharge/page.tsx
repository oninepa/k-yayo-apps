"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Coins, CreditCard, DollarSign, Star } from "lucide-react";

interface RechargeOption {
  id: string;
  points: number;
  price: number;
  bonus: number;
  popular?: boolean;
}

const PointRechargePage = () => {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");

  const rechargeOptions: RechargeOption[] = [
    {
      id: "basic",
      points: 100,
      price: 10,
      bonus: 0,
    },
    {
      id: "popular",
      points: 250,
      price: 20,
      bonus: 25,
      popular: true,
    },
    {
      id: "premium",
      points: 500,
      price: 35,
      bonus: 75,
    },
    {
      id: "vip",
      points: 1000,
      price: 60,
      bonus: 200,
    },
  ];

  const paymentMethods = [
    {
      id: "card",
      name: "Credit Card",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: (
        <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
          P
        </div>
      ),
    },
  ];

  const selectedRechargeOption = rechargeOptions.find(
    (option) => option.id === selectedOption
  );

  const handleRecharge = async () => {
    if (!user || !selectedRechargeOption) {
      setMessage("Please select a recharge option.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // TODO: Implement payment processing
      // await processPayment(user.uid, selectedRechargeOption, paymentMethod);
      setMessage(
        "Payment processed successfully! Points will be added to your account."
      );

      // Redirect to shop after successful payment
      setTimeout(() => {
        router.push("/points/shop");
      }, 2000);
    } catch (error) {
      console.error("Payment failed:", error);
      setMessage("Payment failed. Please try again.");
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
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Coins className="text-yellow-500" size={24} />
              <h1 className="text-2xl font-bold">Recharge Points</h1>
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
              message.includes("successfully")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recharge Options */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Select Recharge Amount</h2>

            <div className="space-y-4">
              {rechargeOptions.map((option) => (
                <div
                  key={option.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedOption === option.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  } ${option.popular ? "relative" : ""}`}
                  onClick={() => setSelectedOption(option.id)}
                >
                  {option.popular && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      Popular
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Coins className="text-yellow-500" size={20} />
                        <span className="text-lg font-semibold">
                          {option.points + option.bonus} Points
                        </span>
                        {option.bonus > 0 && (
                          <span className="text-sm text-green-600">
                            (+{option.bonus} bonus)
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        ${option.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        ${option.price.toFixed(2)}
                      </div>
                      {option.bonus > 0 && (
                        <div className="text-sm text-green-600">
                          Save $
                          {(
                            ((option.bonus / 10) * option.price) /
                            option.points
                          ).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method & Summary */}
          <div className="space-y-6">
            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      paymentMethod === method.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-blue-600">{method.icon}</div>
                      <span className="font-medium">{method.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            {selectedRechargeOption && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Points:</span>
                    <span className="font-semibold">
                      {selectedRechargeOption.points +
                        selectedRechargeOption.bonus}{" "}
                      Points
                    </span>
                  </div>

                  {selectedRechargeOption.bonus > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Bonus:</span>
                      <span>+{selectedRechargeOption.bonus} Points</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="capitalize">{paymentMethod}</span>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-blue-600">
                        ${selectedRechargeOption.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleRecharge}
                  disabled={loading || !selectedOption}
                  className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Processing..." : "Proceed to Payment"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">How Points Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold mb-2">Purchase Points</h3>
              <p className="text-sm text-gray-600">
                Buy points using secure payment methods
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Coins className="text-green-600" size={24} />
              </div>
              <h3 className="font-semibold mb-2">Use Points</h3>
              <p className="text-sm text-gray-600">
                Spend points on items in the shop
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="text-purple-600" size={24} />
              </div>
              <h3 className="font-semibold mb-2">Earn Points</h3>
              <p className="text-sm text-gray-600">
                Earn points by participating in activities
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointRechargePage;
