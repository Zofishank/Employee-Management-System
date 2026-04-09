import React from 'react'
import { FaSearch } from "react-icons/fa";

const Searchbar = () => {
  return (
    <div className="h-20 flex items-center justify-center px-4 ">
      <div className="searchbar w-full h-9 bg-white/70 rounded-full flex items-center justify-between px-5 text-md">
        <input
          type="text"
          placeholder="Search"
          className="w-full h-full bg-transparent outline-none text-black text-md placeholder:text-black/80 placeholder:text-sm"
        />
        <FaSearch className="relative top-0 left-0 text-black" />
      </div>
    </div>
  );
}

export default Searchbar