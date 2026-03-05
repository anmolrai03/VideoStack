import React from "react";

export default function ActionButton({
  buttonName,
  clickHandler,
  loading = false,
  cssClass = "",
  icon,
  iconPosition = "left",
  iconSize = 14, // Default icon size
}) {
  // Clone icon with custom size if it's a valid React element
  const renderIcon = () => {
    if (!icon) return null;
    
    // If icon is a React element, clone it with new size
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon, {
        size: iconSize,
        className: `${icon.props.className || ''} inline-block`
      });
    }
    
    // If icon is not a React element (like a string/emoji), return as is
    return icon;
  };

  return (
    <button
      className={`vs-btn ${cssClass} ${
        loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={clickHandler}
      disabled={loading}
    >
      {loading ? (
        "..."
      ) : (
        <span className="flex justify-center items-center gap-1"> {/* Minimal gap between elements */}
          {icon && iconPosition === "left" && renderIcon()}
          <span>{buttonName}</span>
          {icon && iconPosition === "right" && renderIcon()}
        </span>
      )}
    </button>
  );
}