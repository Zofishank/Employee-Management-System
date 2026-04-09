import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import AuthProvider from "./Context/AuthProvider.jsx";
import NotificationsProvider from "./Components/Employee/notifications/Notifications";

createRoot(document.getElementById("root")).render(
  <NotificationsProvider>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </NotificationsProvider>
);
