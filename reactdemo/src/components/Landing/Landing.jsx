import React, { useEffect, useState } from "react";
import "./landing.css";
// import CatalogFeatures from "./CatalogFeatures";
import Icons from "../helpers/Icons";
import * as handtrack from "../helpers/handtrack";

let vidOn = false;
const Landing = () => {
  // const [imageWidth, imageHeight] = [450, 431];
  const [imageWidth, imageHeight] = [430, 430];

  const [model, setModel] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [canvas, setCanvas] = useState(null);
  const [context, setContext] = useState(null);
  const [video, setVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    handtrack.load().then((model) => {
      setModel(model);
      console.log(model);
    });

    const _canvas = document.getElementById("outputcanvas");
    setCanvas(_canvas);
    setContext(_canvas.getContext("2d"));
    setVideo(document.getElementById("videoel"));
  }, []);

  useEffect(() => {
    const input = document.getElementById("inputholder");
    if (model && context && canvas) {
      // document.getElementById("outputcanvas").style.height = "350px";
      // document.getElementById("videoel").style.height = "350px";
      detectImage(input);
    }
  }, [model, context, canvas]);

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
  };

  const detectImage = (input) => {
    model.detect(input).then((predictions) => {
      console.log(predictions);
      model.renderPredictions(predictions, canvas, context, input);
    });
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
        if (status) {
          // updateNote.innerText = "Video started. Now tracking"
          // isVideo = true
          vidOn = true;
          setIsPlaying(true);
          runDetection();
        } else {
          // updateNote.innerText = "Please enable video";
        }
      });
    } else {
      handtrack.stopVideo(video);
      setIsPlaying(false);
      vidOn = false;
    }
  };

  const poseList = handtrack.colorMap.keys;

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
            (i == selectedImage
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
                {" "}
                🧳{" "}
                <span className="ml-2 font-semibold ">
                  {" "}
                  New in v{handtrack.version}
                </span>
                <div className="mt-3">
                  {" "}
                  &#x2192; 5 new hand pose tags added.
                </div>
                <div className="mt-1">
                  &#x2192; 3 model accuracy blocks - small, medium, large.
                </div>
                <div className="mt-1 mb-2">
                  &#x2192; 3 model sizes - small, medium, large.
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
                onClick={webcamClick}
                className="group  cursor-pointer pr-6 hover:bg-indigo-800 bg-indigo-900 p-2 px-4 rounded-sm inline-block"
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
                <span className="inline-block transition duration-500 agroup-hover:translate-x-2 transform  ml-1 text-sm">
                  Detect hands from Webcam
                </span>{" "}
              </button>
              <span className="block text-xs mt-2">
                Try it on your own webcam video in realtime!
              </span>
            </div>
          )}
        </div>
      </div>
      <div className=" h-72  z-0 w-full   bg-indigo-600  transform skew-y-3"></div>
      <div className="absolute z-0 w-full  -mt-28     ">
        <div className="container-fluid px-4 text-white pb-3 text-sm">
          {" "}
          {/* Or, Select an image below to detect hands */}
        </div>
        <div className="container-fluid px-4  flex flex-row">
          <div className=" flex-grow mr-4 bg-indigo-50 p-3 min-h-content border rounded  ">
            {/* <div className=" text-gray-600  text-sm mb-3">
              {" "}
              Select an image to see predictions.{" "}
            </div> */}
            <div className="grid grid-cols-5 gap-3 min-h-content  ">
              {imageList}
            </div>
          </div>
          <div>
            <div className="transition ease-in duration-700 bg-indigo-50 p-3 rounded relative">
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
              <div className="z-10 ">
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
