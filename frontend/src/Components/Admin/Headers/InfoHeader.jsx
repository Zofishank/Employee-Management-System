import React from 'react'
import Lottie from "lottie-react";
import InfoIcon from "../../../assets/infoIcon.json";

const InfoHeader = () => {
  return (
    <div className="historyHeader w-full flex items-start justify-between">
      <h1 className="text-xl flex items-center gap-2 text-white font-semibold cursor-pointer">
        <Lottie
          animationData={InfoIcon}
          loop={true}
          autoplay={true}
          style={{ width: "35px", height: "35px" }}
        />
        Employees Info
      </h1>
    </div>
  );
}

export default InfoHeader