import React from 'react'
import Lottie from "lottie-react";
import { GiProgression } from "react-icons/gi";
import performanceIcon from "../../../assets/performanceIcon.json"; 

const ProgressHeader = () => {
  return (
    <div className="historyHeader w-full flex items-start justify-between">
      <h1 className="text-xl flex items-center gap-2 text-sky-400 font-semibold cursor-pointer">
        <Lottie
          animationData={performanceIcon}
          loop={true}
          autoplay={true}
          style={{ width: "40px", height: "40px" }}
        />
        Employee Performance Report
      </h1>
    </div>
  );
}

export default ProgressHeader