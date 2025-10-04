import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export default function Toast({ message, type = "info", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // fecha em 3s
    return () => clearTimeout(timer);
  }, [onClose]);

  const getBackground = () => {
    switch (type) {
      case "success":
        return "#4CAF50"; 
      case "error":
        return "#f44336"; 
      default:
        return "#333"; 
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: getBackground(),
        color: "#fff",
        padding: "1rem 1.5rem",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        fontSize: "1rem",
        zIndex: 1000,
        animation: "fadeIn 0.3s ease",
      }}
    >
      {message}
    </div>
  );
}
