import React from "react";

const getAvatarStyle = (name) => {
  if (!name) return { backgroundColor: "#5138eb", color: "#ffffff" };
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  // Using premium vibrant pastel colors
  return {
    backgroundColor: `hsl(${hue}, 65%, 45%)`,
    color: "#ffffff",
    fontWeight: "600",
    textShadow: "0px 1px 2px rgba(0,0,0,0.2)",
  };
};

const getTextSize = (size) => {
  if (size.includes("size-32") || size.includes("h-32")) return "text-4xl";
  if (size.includes("size-24") || size.includes("h-24")) return "text-2xl";
  if (size.includes("size-12") || size.includes("h-12")) return "text-lg";
  return "text-sm";
};

const Avatar = ({ user, src, size = "size-10", className = "" }) => {
  if (!user) return null;

  const { profilePic, fullName } = user;
  const imageToDisplay = src || profilePic;

  if (imageToDisplay) {
    return (
      <img
        src={imageToDisplay}
        alt={fullName || "User Avatar"}
        className={`${size} object-cover rounded-full ${className}`}
      />
    );
  }

  const initial = fullName ? fullName.charAt(0).toUpperCase() : "?";
  const style = getAvatarStyle(fullName);
  const textSizeClass = getTextSize(size);

  return (
    <div
      style={style}
      className={`${size} rounded-full flex items-center justify-center select-none font-bold ${textSizeClass} border border-base-300 ${className}`}
    >
      {initial}
    </div>
  );
};

export default Avatar;
