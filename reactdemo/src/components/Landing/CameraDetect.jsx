import React from "react";
import Icons from "../helpers/Icons";

const CameraDetect = ({
  cameraLoading,
  webcamClick,
  model,
  isPlaying,
  webCamError,
}) => {
  return (
    <div className="  mb-4 ">
      {
        <div className="">
          <button
            disabled={cameraLoading || !model}
            onClick={webcamClick}
            className={
              (model ? " " : "opacity-50 ") +
              (isPlaying ? " ring-4 " : " ") +
              "   whitespace-nowrap  transition relative duration-500 group  cursor-pointer  hover:bg-green-500 bg-green-400   rounded  inline-block"
            }
          >
            {!isPlaying && (
              <span className="absolute -right-5 -top-7  opacity-80">
                <Icons icon="tryme" />
              </span>
            )}
            <div
              className={
                (isPlaying ? "bg-white  " : " bg-indigo-800 ") +
                " inline-block transition duration-1000  p-2  pb-3   pl-4 border-opacity-70 border-indigo-200 rounded-r-none pborder rounded "
              }
            >
              {!isPlaying && !cameraLoading && <Icons icon="video" size={4} />}
              {cameraLoading && <Icons icon="loading" size={4} />}
              {isPlaying && (
                <div className="h-full w-4 inline-block pt-2  mr-1">
                  <span className="flex h-3 w-3 relative  ">
                    <span className="animate-ping absolute  inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </div>
              )}
            </div>
            <span className="p-2  whitespace-nowrap pr-4 inline-block transition duration-700  transform  ml-1 text-sm">
              Detect hands from <span className="font-semiboldo">webcam</span>
            </span>{" "}
          </button>
          {
            <span
              className={
                (model ? " opacity-0 " : " ") +
                "block text-xs mt-2 transition duration-700"
              }
            >
              {" "}
              <Icons icon="loading" size={4} />
              <span className=" "> loading handtrack.js model .. </span>
            </span>
          }
          <span className="block text-xs mt-2">
            {/* Try it on your own webcam video in realtime! */}
            {webCamError && !webCamError.status && (
              <span className=" block text-red-500 mt-1 ">
                {JSON.stringify(webCamError.msg.message)}. Please ensure you
                have granted webcam permissions.
              </span>
            )}
          </span>
        </div>
      }
    </div>
  );
};

export default CameraDetect;
