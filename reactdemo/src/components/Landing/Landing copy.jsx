import React, { useEffect, useState } from "react";
import "./landing.css";
// import CatalogFeatures from "./CatalogFeatures";
import Icons from "../helpers/Icons";
import * as handtrack from "../helpers/handtrack";

let vidOn = false;
const Landing = () => {
  // const [imageWidth, imageHeight] = [450, 431];
  const [imageWidth, imageHeight] = [400, 350];

  const [model, setModel] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [webCamError, setWebCamError] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [context, setContext] = useState(null);
  const [video, setVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const detectImage = (input) => {
    model.detect(input).then((predictions) => {
      // console.log(predictions);
      model.renderPredictions(predictions, canvas, context, input);
    });
  };

  useEffect(() => {
    handtrack.load().then((model) => {
      setModel(model);
      // console.log(model);
    });

    const _canvas = document.getElementById("outputcanvas");
    setCanvas(_canvas);
    setContext(_canvas.getContext("2d"));
    setVideo(document.getElementById("videoel"));
  }, []);

  useEffect(() => {
    const input = document.getElementById("inputholder");
    if (model && context && canvas) {
      model.detect(input).then((predictions) => {
        model.renderPredictions(predictions, canvas, context, input);
      });
    }
  }, [model, context, canvas]);

  useEffect(() => {
    return () => {
      if (model) {
        // model.dispose();
        console.log("model cleaned up");
      }
    };
  }, [model]);

  const imageIdx = [];
  const maxImages = 10;
  for (let i = 0; i < maxImages; i++) {
    imageIdx.push(i);
  }

  const imageClick = (e) => {
    // console.log(e.target.getAttribute("imageid"));
    const input = document.getElementById("inputholder");
    input.src = e.target.src;
    detectImage(input);
    setSelectedImage(e.target.getAttribute("imageid"));
    // console.log(predictions);
    stopVideoPlay();
  };

  const runDetection = async () => {
    const predictions = await model.detect(video);
    model.renderPredictions(predictions, canvas, context, video);
    // console.log(vidOn, "Predictions: ", predictions);
    if (vidOn) {
      requestAnimationFrame(() => {
        runDetection();
      });
    }
  };

  const webcamClick = (e) => {
    if (!isPlaying) {
      setCameraLoading(true);
      handtrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        setCameraLoading(false);
        if (status.status) {
          setWebCamError(status);
          // updateNote.innerText = "Video started. Now tracking"
          // isVideo = true
          vidOn = true;
          setIsPlaying(true);
          runDetection();
        } else {
          // updateNote.innerText = "Please enable video";
          setWebCamError(status);
        }
      });
    } else {
      stopVideoPlay();
      setTimeout(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        detectImage(document.getElementById("inputholder"));
      }, 300);
    }
  };

  const stopVideoPlay = () => {
    if (isPlaying || vidOn) {
      handtrack.stopVideo(video);
      setIsPlaying(false);
      vidOn = false;
    }
  };

  const poseList = Object.keys(handtrack.colorMap).map((data, i) => {
    return (
      <div className="text-xs inline  " key={"poserow" + i}>
        <span
          style={{ borderBottom: "3px solid " + handtrack.colorMap[data] }}
          className="p-1 inline-block mb-1 font-semibold bg-white rounded rounded-b-none    px-2"
        >
          {" "}
          {data}
        </span>{" "}
      </div>
    );
  });

  const imageList = imageIdx.slice(0, maxImages).map((data, i) => {
    return (
      <div className="inline-block  " key={"imgrow" + i}>
        <img
          imageid={i}
          alt={"sample of hands"}
          onClick={imageClick}
          className={
            "rounded shadow transition duration-800 border-4 border-l-0 border-r-0 border-t-0 border-white " +
            (!model ? "grayscale pointer-events-none" : " cursor-pointer  ") +
            (i + "" === selectedImage + ""
              ? " border-4 border-l-0 border-r-0 border-t-0 border-indigo-500 "
              : " ")
          }
          style={{ objectFit: "cover", height: "100px", width: "100%" }}
          src={"images/samples/" + i + ".jpg"}
        />
      </div>
    );
  });

  return (
    <div className="-mb-10   relative">
      <div className="absolute w-full   z-10 ">
        <div className="container-fluid px-4  text-white">
          <div className="flex flex-row">
            <div className="flex-grow  flex flex-row  mr-3">
              <div className="h-20  mr-4">
                {/* <a href={process.env.PUBLIC_URL + "/#"}> */}
                <img
                  className="min-h-content  w-20"
                  src={process.env.PUBLIC_URL + "/images/logo.png"}
                  alt={"logo"}
                />

                {/* <img
                  id="pageicon"
                  style={{ width: "200px", height: "200px" }}
                  src={process.env.PUBLIC_URL + "/images/logo.png"}
                  alt={"logo"}
                /> */}
                {/* </a>{" "} */}
              </div>
              <div className="  ">
                <div className="text-3xl font-semibold">
                  {" "}
                  Handtrack.js{" "}
                  <span className="text-sm">v{handtrack.version}</span>
                </div>
                <div className="mt-2">
                  {" "}
                  A library for prototyping hand tracking in Javascript. In the
                  browser.{" "}
                </div>
              </div>
            </div>
            <div className="w-96 -mt-2 bg-indigo-800 shadow-xl rounded text-sm p-3 px-5">
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
                  New in v{handtrack.version}
                </span>
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
          </div>
          {!model && (
            <div className="">
              {" "}
              <Icons icon="loading" />{" "}
              <span className="text-sm">loading handtrack model ..</span>{" "}
            </div>
          )}
          {model && (
            <div className="-mt-6">
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
                  {!isPlaying && !cameraLoading && (
                    <Icons icon="video" size={4} />
                  )}
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
      </div>
      <div className=" h-72  z-0 w-full   bg-indigo-600  transform -skew-y-3"></div>
      <div className="absolute z-0 w-full  -mt-24     ">
        <div className="container-fluid px-4 text-white pb-3 text-sm">
          {" "}
          {/* Or, Select an image below to detect hands */}
        </div>
        <div className="container-fluid px-4  flex flex-row">
          <div className=" flex-grow mr-4 rounded  ">
            {/* <div className=" text-gray-600  text-sm mb-3">
              {" "}
              Select an image to see predictions.{" "}
            </div> */}
            {/* <div className=" bg-indigo-50 mb-3 p-3 rounded grid grid-cols-5 gap-3 min-h-content  ">
              Welcome!
            </div> */}
            <div className=" bg-indigo-50 p-3 rounded  min-h-content  ">
              <div className="mb-2">
                {/* <div className="  font-semibold text-gray-900">
                  Detect Hands from Image, Video, Canvas HTML Tags
                </div> */}
                <div className="text-gray-600 text-sm">
                  Select an image below to run live detection.
                </div>
              </div>
              <div className="grid grid-cols-5 gap-3"> {imageList}</div>
            </div>

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
                    Use Handtrack | 3 lines of code
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
              {/* <span className="block text-sm text-gray-600 mb-2">
                {" "}
                Get started in 3 lines of code!{" "}
              </span>
              <span className="text-sm block">
                <CodeBlock
                  text={sampleCode}
                  language={"javascript"}
                  showLineNumbers={false}
                  theme={nord}
                />
              </span> */}
            </div>
          </div>
          <div>
            <div className="transition ease-in duration-700 bg-indigo-50 p-3 rounded relative">
              <div className="  mb-2 rounded-sm  ">{poseList}</div>

              <div
                className="hidden"
                style={{
                  minWidth: imageWidth + "px",
                  minHeight: "100px",
                }}
              >
                <video
                  className="rounded  "
                  style={{
                    width: imageWidth + "px",
                    height: imageHeight + "px",
                  }}
                  autoPlay="autoplay"
                  id="videoel"
                ></video>
              </div>
              <div className="z-10 relative">
                {!model && (
                  <div className="text-gray-600 text-sm absolute border w-full h-full   flex justify-center items-center">
                    {" "}
                    <div className="px-4">
                      {" "}
                      <Icons icon="loading" /> loading handtrack model ..{" "}
                    </div>
                  </div>
                )}
                <canvas
                  className=" rounded  transition duration-500 "
                  style={{
                    width: imageWidth + "px",
                    height: imageHeight + "px",
                  }}
                  id="outputcanvas"
                ></canvas>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="container-fluid px-4 border">
          <div className="text-2xl font-semibold text-gray-600">
            Dead Easy to Use!
          </div>
          <div className="h-72"></div>
        </div> */}
        <img
          id="inputholder"
          alt="hidden holder for larger version of samples."
          src="images/samples/0.jpg"
          className="hidden"
          style={{ width: imageWidth + "px", height: imageHeight + "px" }}
        />
      </div>
    </div>
  );
};

export default Landing;
