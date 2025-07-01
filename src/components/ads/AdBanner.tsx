import React from "react";

interface AdBannerProps {
  type?: "horizontal" | "vertical" | "square";
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({
  type = "horizontal",
  className = "",
}) => {
  const getAdStyles = () => {
    switch (type) {
      case "horizontal":
        return "w-full h-20 bg-gradient-to-r from-blue-400 to-purple-500";
      case "vertical":
        return "w-60 h-80 bg-gradient-to-b from-green-400 to-blue-500";
      case "square":
        return "w-60 h-60 bg-gradient-to-br from-yellow-400 to-red-500";
      default:
        return "w-full h-20 bg-gradient-to-r from-blue-400 to-purple-500";
    }
  };

  return (
    <div
      className={`${getAdStyles()} ${className} flex items-center justify-center text-white font-bold rounded-lg shadow-lg`}
    >
      <div className="text-center">
        <div className="text-sm opacity-75">Advertisement</div>
        <div className="text-xs opacity-50">Google AdSense</div>
      </div>
    </div>
  );
};

export default AdBanner;
