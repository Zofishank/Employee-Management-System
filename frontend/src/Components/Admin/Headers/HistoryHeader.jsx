import React from 'react'
import Lottie from "lottie-react";
import HistoryIcon from "../../../assets/HistoryIcon.json"; 

const HistoryHeader = () => {
  return (
    <div className="historyHeader w-full flex items-start justify-between">
      <h1 className="text-xl flex items-center gap-2 text-white font-semibold cursor-pointer px-3 ">
        <Lottie
          animationData={HistoryIcon}
          loop={true}
          autoplay={true}
          style={{ width: "35px", height: "35px" }}
        />
        Task History
      </h1>
    </div>
  );
}

export default HistoryHeader