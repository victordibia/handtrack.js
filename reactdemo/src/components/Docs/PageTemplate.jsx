import React, { useEffect, useState } from "react";

const Docs = () => {
  // load model on page load
  useEffect(() => {
    document.title = "Handtrack.js | Documentation";
  }, []);

  return (
    <div className="relative">
      <div className="w-full absolute  grid grid-rows-1 grid-flow-col  ">
        <div className="row-start-1 bg-indigo-600 col-start-1 h-16 "></div>
        <div className="row-start-1 h-96 col-start-1 w-full  bg-indigo-600 transform -skew-y-3 e"></div>
      </div>
      <div className="w-full absolute  z-10">
        <div className="container-fluid px-4 bg-indigo-300  text-white">
          Skew Box
        </div>
      </div>
    </div>
  );
};

export default Docs;
