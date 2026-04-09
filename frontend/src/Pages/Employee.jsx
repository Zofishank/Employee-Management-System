import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import EmployeeSidebar from "../Components/Employee/SidebarMenu/EmployeeSidebar";
import Dashboard from "../Components/Employee/Dashboard/Dashboard";
import Tasks from "../Components/Employee/Tasks/manageTasks";
import TaskDetails from "../Components/Employee/TaskDetail/TaskDetails";
import EditProfile from "../Components/Employee/EditProfile/editProfile";
import AIAssistant from "../Components/Employee/aiAssistant/aiAssistant";
import MyProgress from "../Components/Employee/MyProgress/myProgress";
import RecentTasks from "../Components/Employee/recentTasks/recentTasks";
import Notifications from "../Components/Employee/notifications/notificationPage";

const Employee = ({ userData }) => {
  const [theme] = useState({
    background: "#0f1123",
    text: "#ffffff",
    secondaryText: "#cfd8e0",
    cardBg: "#1A1C2C",
    cardHover: "#222538",
    accent: "#38bdf8",
  });

  return (
    <div className="min-h-screen bg-[#080C14] text-white">
      <EmployeeSidebar userData={userData} />

      <Routes>
        {/* Default redirect */}
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard theme={theme} />} />
        <Route path="tasks" element={<Tasks theme={theme} />} />
        <Route path="tasks/:id" element={<TaskDetails userData={userData} />} />
        <Route path="assistant" element={<AIAssistant />} />
        <Route path="progress" element={<MyProgress />} />
        <Route path="profile" element={<EditProfile />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<RecentTasks theme={theme} />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </div>
  );
};

export default Employee;
