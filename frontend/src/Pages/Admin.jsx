import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "../Components/Admin/SidebarMenu/AdminSidebar";
import AddTask from "../Components/Admin/AddTask/AddTask";
import TaskHistory from "../Components/Admin/TaskHistory/TaskHistory";
import EmployeeDirectory from "../Components/Admin/EmployeeDirectory/EmployeeDirectory";
import EmployeePerformance from "../Components/Admin/performance/EmployeePerformance";
import AdminEmployeeQueries from "../Components/Admin/EmployeeQueries/EmployeeQueries";
import AdminDashboard from "../Components/Admin/Dashboard/AdminDashboard";

const Admin = () => {
  return (
    <div className="min-h-screen">
      <AdminSidebar />
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="add-task" element={<AddTask />} />
        <Route path="task-history" element={<TaskHistory />} />
        <Route path="employees" element={<EmployeeDirectory />} />
        <Route path="performance" element={<EmployeePerformance />} />
        <Route path="queries" element={<AdminEmployeeQueries />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </div>
  );
};
export default Admin;
