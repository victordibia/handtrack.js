import React, { useState } from "react";

const ModelConfig = ({ version }) => {
  const defaultParams = {
    flipHorizontal: false,
    outputStride: 16,
    imageScaleFactor: 1,
    maxNumBoxes: 20,
    iouThreshold: 0.2,
    scoreThreshold: 0.6,
    modelType: "ssd320fpnlite",
    modelSize: "base",
    bboxLineWidth: "2",
    fontSize: 14,
  };

  const [scoreThreshold, setScoreThreshold] = useState(65);

  return (
    <div className=" text-gray-700  border border-indigo-500 bg-indigo-100 sphadow-xl rounded text-sm py-3 px-4">
      <div className="font-semibold"> Configure Handtrack.js </div>
      <div className="mt-2   ">
        <span className="mr-2 mb-2 inline-flex items-center bg-indigo-200 p-2 rounded px-3">
          horizontal flip{" "}
          <input
            className="ml-2  "
            type="checkbox"
            id="huey"
            name="drone"
            value="huey"
          />
        </span>
        <span className="mr-2 mb-2 inline-flex items-center bg-indigo-200 p-2 rounded px-3">
          model size{" "}
          <select className="ml-2 px-1 rounded" name="cars" id="cars">
            <option value="volvo">large</option>
            <option value="saab">medium</option>
            <option value="mercedes">small</option>
          </select>
        </span>
        {/* <span className="mr-2 mb-2 inline-flex items-center bg-indigo-200 p-2 rounded px-3">
          horizontal flip{" "}
          <input
            className="ml-2  "
            type="checkbox"
            id="huey"
            name="drone"
            value="huey"
          />
        </span> */}
      </div>
      <div className="border p-2 px-3 bg-indigo-200  rounded">
        <div className="flex items-center">
          <div className="mr-4"> score threshold </div>
          <div className="flex-grow">
            <input
              type="range"
              min="1"
              max="100"
              // value={scoreThreshold}
              onChange={(e) => {
                setScoreThreshold(e.target.value);
                // document.getElementById("scorebox").innerHTML = e.target.value;
              }}
              className="slider w-full"
              id="myRange"
            />
          </div>
          <div
            id="scorebox"
            className="w-12 text-center text-xl font-semibold ml-2"
          >
            {" "}
            {(scoreThreshold / 100).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelConfig;
