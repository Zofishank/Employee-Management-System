import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Admin from "./Pages/Admin";
import Logout from "./Pages/logout";
import Employee from "./Pages/Employee";
import NotificationsProvider from "./Components/Employee/notifications/Notifications";

/* =======================
   🔐 Helper Functions
======================= */
const getToken = () => localStorage.getItem("token");

const getUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    // Clear invalid data
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return null;
  }
};

const isAuthenticated = () => {
  const token = getToken();
  const user = getUser();
  return !!(token && user);
};

const getUserRole = () => {
  const user = getUser();
  return user?.role || null;
};

/* =======================
   🔐 Protected Route (Any authenticated user)
======================= */
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

/* =======================
   🔐 Admin Route (Only admin users)
======================= */
const AdminRoute = ({ children }) => {
  const token = getToken();
  const user = getUser();

  // Check if user is authenticated AND has admin role
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    console.warn(
      "Admin access denied for user:",
      user.email,
      "Role:",
      user.role,
    );
    return <Navigate to="/employee" replace />;
  }

  return children;
};

/* =======================
   🔐 Employee Route (Only employee users)
======================= */
const EmployeeRoute = ({ children }) => {
  const token = getToken();
  const user = getUser();

  // Check if user is authenticated AND has employee role
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "employee") {
    console.warn(
      "Employee access denied for user:",
      user.email,
      "Role:",
      user.role,
    );
    return <Navigate to="/admin" replace />;
  }

  return children;
};

/* =======================
   🔐 Role-based Redirect
======================= */
const RoleBasedRedirect = () => {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on role
  switch (user.role) {
    case "admin":
      return <Navigate to="/admin" replace />;
    case "employee":
      return <Navigate to="/employee" replace />;
    default:
      console.warn("Unknown user role:", user.role);
      // Clear invalid role data
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
  }
};

/* =======================
   🔐 Public Route Guard (Redirect if already logged in)
======================= */
const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    const role = getUserRole();
    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (role === "employee") {
      return <Navigate to="/employee" replace />;
    }
  }
  return children;
};

/* =======================
   🚀 Main App Component
======================= */
const App = () => {
  return (
    <>
      <NotificationsProvider>
        <Routes>
          {/* Public routes - accessible without authentication */}
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Root path - redirects based on user role */}
          <Route path="/" element={<RoleBasedRedirect />} />

          {/* Logout route */}
          <Route path="/logout" element={<Logout />} />

          {/* Admin routes - only accessible by admin users */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />

          {/* Employee routes - only accessible by employee users */}
          <Route
            path="/employee/*"
            element={
              <EmployeeRoute>
                <Employee />
              </EmployeeRoute>
            }
          />

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </NotificationsProvider>

      {/* Custom Styled Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{
          top: "20px",
          right: "20px",
        }}
        toastStyle={{
          background: "#0a1020",
          color: "#fff",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
          fontSize: "14px",
          padding: "12px 16px",
        }}
        progressStyle={{
          background: "linear-gradient(90deg, #4f75f0, #4f75f0)",
          height: "3px",
        }}
      />
    </>
  );
};

export default App;
