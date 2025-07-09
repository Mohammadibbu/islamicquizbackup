import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Correct import

export const showToast = (message, messageType = "info", duration = 3000) => {
  const options = {
    position: "bottom-center",
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  switch (messageType) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "warning":
      toast.warn(message, options);
      break;
    case "info":
    default:
      toast.info(message, options);
      break;
  }
};

const Toastify = () => {
  return <ToastContainer />;
};

export default Toastify;
