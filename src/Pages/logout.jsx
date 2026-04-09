import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../Components/Employee/notifications/Notifications";

const Logout = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    // Clear auth info
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Show notification
    showNotification("Logged out successfully", "success");

    // Redirect to login after short delay (optional: 500ms for animation)
    const timer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 500);

    return () => clearTimeout(timer);
  }, [navigate, showNotification]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0F172A] text-white">
      <p className="text-lg">Logging out...</p>
    </div>
  );
};

export default Logout;
