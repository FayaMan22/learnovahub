import { useEffect } from "react";
import "./common.css";

export default function Toast({
  toast,
  onClose,
  duration = 4000,
}) {
  useEffect(() => {
    if (!toast || !onClose) {
      return;
    }

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [toast, onClose, duration]);

  if (!toast) {
    return null;
  }

  const type = toast.type || "success";

  return (
    <div
      className={`common-toast common-toast-${type}`}
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
    >
      <span className="common-toast-icon">
        {type === "success" && "✓"}
        {type === "error" && "!"}
        {type === "warning" && "!"}
        {type === "info" && "i"}
      </span>

      <p>{toast.message}</p>

      <button
        type="button"
        className="common-toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}