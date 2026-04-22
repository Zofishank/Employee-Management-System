import React from "react";
import Welcome from "./Welcome/Welcome";
import Progress from "./Progress/Progress";
import RecentTasks from "../recentTasks/recentTasks";
import AppreciationBanner from "./AppreciationBanner";


const Dashboard = ({ theme }) => {
  return (
    <div className="md:ml-64 min-h-screen bg-[#080C14] px-4 md:px-10 pt-16 md:pt-8 pb-8 flex flex-col gap-8">
      <AppreciationBanner />
      <Welcome theme={theme} />
      <Progress theme={theme} />
      <RecentTasks theme={theme} />
    </div>
  );
};

export default Dashboard;
