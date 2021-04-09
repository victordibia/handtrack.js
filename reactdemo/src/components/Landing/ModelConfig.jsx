import React from "react";
import Icons from "../helpers/Icons";

const ModelConfig = ({ config, model }) => {
  // const defaultParams = {
  //   flipHorizontal: false,
  //   outputStride: 16,
  //   imageScaleFactor: 1,
  //   maxNumBoxes: 20,
  //   iouThreshold: 0.2,
  //   scoreThreshold: 0.6,
  //   modelType: "ssd320fpnlite",
  //   modelSize: "base",
  //   bboxLineWidth: "2",
  //   fontSize: 14,
  // };

  return (
    <div className=" relative text-gray-700 pb-2    bg-indigo-100 sphadow-xl rounded text-sm  ">
      {!model && (
        <div className="rounded p-3 flexp justify-centerp items-centerp w-full h-full absolute bg-indigo-200   z-10">
          <div className=" ">
            <Icons icon="loading" size={4} /> loading handtrack model
          </div>{" "}
          <div className="animate-pulse   w-full grid grid-cols-4 gap-4 h-full pt-2">
            <div className="bg-gray-200 h-8 rounded"></div>
            <div className="bg-gray-200 h-8 rounded"></div>
            <div className="bg-gray-100 h-8 rounded"></div>
            <div className="bg-gray-50 h-8 rounded"></div>
          </div>
        </div>
      )}
      <div className="px-3 pt-2"> Configure Handtrack.js </div>
      <div className="mt-2 md:flex flex-row px-3   ">
        <div className="mr-2 whitespace-nowrap mb-2 inline-flex items-center  p-2 border-gray-500 border bg-white  rounded px-3">
          horizontal flip{" "}
          <input
            className="ml-2  "
            type="checkbox"
            id="imageflip"
            defaultChecked={config.imageFlip.get}
            // defaultValue={config.imageFlip.get}
            value={true}
            onChange={(e) => {
              config.imageFlip.set(e.target.checked);
            }}
          />
        </div>

        <div className="h-full whitespace-nowrap  inline-flex  mr-2 mb-2   items-center border-gray-500 border bg-white p-2 rounded px-3">
          model type{" "}
          <select
            className="ml-2 rounded border border-gray-500"
            name="modeltype"
            defaultValue={config.modelType.get}
            id="modeltype"
            onChange={(e) => {
              config.modelType.set(e.target.value);
            }}
          >
            <option value="ssd320fpnlite">ssd320 </option>
            <option value="ssd640fpnlite">ssd640 </option>
          </select>
        </div>

        <div className="h-full whitespace-nowrap  inline-flex  mr-2 mb-2   items-center border-gray-500 border bg-white p-2 rounded px-3">
          model size{" "}
          <select
            className="ml-2 rounded  border border-gray-500"
            name="modelSize"
            id="modelsize"
            defaultValue={config.modelSize.get}
            onChange={(e) => {
              config.modelSize.set(e.target.value);
            }}
          >
            <option value="large">large</option>
            <option value="medium">medium</option>
            <option value="small">small</option>
          </select>
        </div>

        <div
          style={{ paddingTop: "6px", paddingBottom: "7px" }}
          className="h-full flex border-gray-500 border bg-white  px-3 mb-2 rounded  flex-grow items-center"
        >
          <div className="mr-4 whitespace-nowrap pt-1 "> score threshold </div>
          <div className="flex-grow  ">
            <input
              type="range"
              min="1"
              max="100"
              value={config.scoreThreshold.get * 100}
              onChange={(e) => {
                config.scoreThreshold.set(e.target.value / 100);
                // document.getElementById("scorebox").innerHTML = e.target.value;
              }}
              className="slider w-full"
              id="myRange"
            />
          </div>
          <div id="scorebox" className="w-12  text-center  font-semibold ml-2">
            {" "}
            {config.scoreThreshold.get.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelConfig;
