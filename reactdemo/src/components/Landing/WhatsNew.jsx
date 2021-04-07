import React from "react";

const WhatsNew = ({ version }) => {
  return (
    <div className="w-96  bg-indigo-800 shadow-xl rounded text-sm p-3 px-5">
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
        <span className="ml-2 font-semibold ">New in v{version}</span>
        <div className="mt-3">
          {" "}
          &#x2192; 6 new hand pose tags added (open, closed, ..).
        </div>
        <div className="mt-1">
          &#x2192; 3 model accuracy blocks - small, medium, large.
        </div>
        <div className="mt-1 mb-2">
          &#x2192; Smaller model weight files, faster load time!
        </div>
      </div>
    </div>
  );
};

export default WhatsNew;
