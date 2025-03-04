/* eslint-disable react/prop-types */
import { useEffect } from "react";

const Alert = ({ type, message, onClose }) => {
  let alertClass = "";

  switch (type) {
    case "success":
      alertClass = "bg-green-700 text-white";
      break;
    case "error":
      alertClass = "bg-red-500 text-white";
      break;
    case "info":
      alertClass = "bg-blue-500 text-white";
      break;
    case "warning":
      alertClass = "bg-yellow-500 text-white";
      break;
    default:
      alertClass = "bg-gray-500 text-white";
  }

  // Auto-close after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Alert colors based on type
  const alertStyles = {
    success: "bg-green-500 border-green-700",
    error: "bg-red-500 border-red-700",
    warning: "bg-yellow-500 border-yellow-700",
  };

  return (
    <div
      className={`fixed left-1/2 top-5 -translate-x-1/2 transform rounded-lg border px-6 py-3 text-white shadow-lg ${alertStyles[type]}`}
    >
      <p>{message}</p>
    </div>
  );
};

export default Alert;
