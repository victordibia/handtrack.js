import React from "react";

const Usage = ({ version }) => {
  return (
    <div className="mt-3 rounded ">
      <div className=" text-white bg-indigo-800 shadow-xl rounded text-sm p-3 px-5">
        <div>
          {/* 🧳{" "} */}
          <span>
            <span className=" relative inline-flex mr-1 rounded-full h-3 w-3 bg-red-500"></span>
            <span>
              <span className="relative inline-flex mr-1 rounded-full h-3 w-3 bg-yellow-500"></span>
              <span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </span>
          </span>
          <span className="ml-2 font-semibold ">
            Use Handtrack.js in 3 lines of code!!
          </span>
          <div className="mt-3">
            {" "}
            <span className="text-yellow-400">import</span> *{" "}
            <span className="text-yellow-400">as</span> handTrack{" "}
            <span className="text-yellow-400">from</span>{" "}
            <span className="text-green-300">'handtrackjs</span>';
          </div>
          <div className="mt-1">
            <span className="text-yellow-400">const</span> model ={" "}
            <span className="text-yellow-400">await</span> handTrack.
            <span className="text-yellow-400">load</span>()
          </div>
          <div className="mt-1 mb-2">
            <span className="text-yellow-400">const</span> predictions ={" "}
            <span className="text-yellow-400">await</span> model.
            <span className="text-yellow-400">detect</span>(img)
          </div>
        </div>
      </div>
    </div>
  );
};

export default Usage;
