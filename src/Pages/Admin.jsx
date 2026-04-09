import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminSidebar from "../Components/Admin/SidebarMenu/AdminSidebar";
import AddTask from "../Components/Admin/AddTask/AddTask";
import TaskHistory from "../Components/Admin/TaskHistory/TaskHistory";
import EmployeeDirectory from "../Components/Admin/EmployeeDirectory/EmployeeDirectory";
import EmployeePerformance from "../Components/Admin/performance/EmployeePerformance";
import AdminEmployeeQueries from "../Components/Admin/EmployeeQueries/EmployeeQueries";

const Admin = () => {
  return (
    <div className="min-h-screen">
      {/* Sidebar handles its own fixed positioning */}
      <AdminSidebar />

      {/* All pages handle their own md:ml-64 offset internally */}
      <Routes>
        <Route index element={<Navigate to="add-task" replace />} />
        <Route path="add-task" element={<AddTask />} />
        <Route path="task-history" element={<TaskHistory />} />
        <Route path="employees" element={<EmployeeDirectory />} />
        <Route path="performance" element={<EmployeePerformance />} />
        <Route path="queries" element={<AdminEmployeeQueries />} />
        <Route path="*" element={<Navigate to="add-task" replace />} />
      </Routes>
    </div>
  );
};

export default Admin;
