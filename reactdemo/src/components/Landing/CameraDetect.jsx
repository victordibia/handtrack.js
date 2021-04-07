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
    <div className="  mb-4">
      {!model && (
        <div className="">
          {" "}
          <Icons icon="loading" />{" "}
          <span className="text-sm">loading handtrack model ..</span>{" "}
        </div>
      )}
      {model && (
        <div className="">
          <button
            disabled={cameraLoading}
            onClick={webcamClick}
            className={
              (isPlaying ? " ring-4 " : " ") +
              " shadow-2xl  transition duration-500 group  cursor-pointer  hover:bg-green-500 bg-green-400   rounded  inline-block"
            }
          >
            <div
              className={
                (isPlaying ? "bg-white  " : " bg-indigo-800 ") +
                " inline-block transition duration-1000  p-2   pl-3 border-opacity-70 border-indigo-200 rounded-r-none border rounded "
              }
            >
              {!isPlaying && !cameraLoading && <Icons icon="video" size={4} />}
              {cameraLoading && <Icons icon="loading" size={4} />}
              {isPlaying && (
                <div className="h-3 w-3 inline-block mr-1">
                  <span className="flex h-3 w-3 relative  ">
                    <span className="animate-ping absolute  inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </div>
              )}
            </div>
            <span className="p-2  pr-4 inline-block transition duration-500 agroup-hover:translate-x-2 transform  ml-1 text-sm">
              Detect hands from Webcam
            </span>{" "}
          </button>
          <span className="block text-xs mt-2">
            Try it on your own webcam video in realtime!
            {webCamError && !webCamError.status && (
              <span className=" block text-red-500 mt-1 ">
                {JSON.stringify(webCamError.msg.message)}. Please ensure you
                have granted webcam permissions.
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
};

export default CameraDetect;
