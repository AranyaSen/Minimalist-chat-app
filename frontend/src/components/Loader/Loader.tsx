import React from "react";
import { LoaderProps } from "@/components/Loader/Loader.types";

const Loader: React.FC<LoaderProps> = () => {
  return (
    <div className="bg-[#88e7ff] h-screen w-screen">
      <div className="fixed top-0 left-0 w-full h-full">
        <div
          className="block relative left-1/2 top-1/2 w-[150px] h-[150px] -ml-[75px] -mt-[75px] rounded-full border-[3px] border-transparent border-t-[#F87171] animate-spin
                      before:content-[''] before:absolute before:top-[5px] before:left-[5px] before:right-[5px] before:bottom-[5px] before:rounded-full before:border-[3px] before:border-transparent before:border-t-[#ff6767] before:animate-[spin_3s_linear_infinite]
                      after:content-[''] after:absolute after:top-[15px] after:left-[15px] after:right-[15px] after:bottom-[15px] after:rounded-full after:border-[3px] after:border-transparent after:border-t-[#ff5151] after:animate-[spin_1.5s_linear_infinite]"
        ></div>
      </div>
    </div>
  );
};

export default Loader;
