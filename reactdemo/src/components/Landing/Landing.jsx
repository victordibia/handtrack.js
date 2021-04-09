import React, { useEffect, useState } from "react";
import "./landing.css";
// import CatalogFeatures from "./CatalogFeatures";
import Icons from "../helpers/Icons";
import * as handtrack from "../helpers/handtrack";
import CameraDetect from "./CameraDetect";
import Usage from "./Usage";
import ModelConfig from "./ModelConfig";
import { GaPageView, getScrollHeight } from "../helpers/HelperFunctions";
import GithubStars from "./GithubStars";

let vidOn = false;
let odModel = null;
const [imageWidth, imageHeight] = [400, 350];
const Landing = () => {
  // const [imageWidth, imageHeight] = [450, 431];

  const [modelLoaded, setModelLoaded] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [webCamError, setWebCamError] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [context, setContext] = useState(null);
  const [video, setVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // library params
  const [imageFlip, setImageFlip] = useState(true);
  const [modelSize, setModelSize] = useState("large");
  const [modelType, setModelType] = useState("ssd320fpnlite");
  const [scoreThreshold, setScoreThreshold] = useState(0.65);

  const libConfig = {
    imageFlip: { get: imageFlip, set: setImageFlip },
    modelSize: { get: modelSize, set: setModelSize },
    modelType: { get: modelType, set: setModelType },
    scoreThreshold: { get: scoreThreshold, set: setScoreThreshold },
  };

  const detectImage = (input) => {
    odModel.detect(input).then((predictions) => {
      // console.log(predictions);
      odModel.renderPredictions(predictions, canvas, context, input);
    });
  };

  useEffect(() => {
    const defaultParams = {
      flipHorizontal: imageFlip,
      outputStride: 16,
      imageScaleFactor: 1,
      maxNumBoxes: 20,
      iouThreshold: 0.4, // 0.4 for nms iou > 60% is dropped
      scoreThreshold: 0.6,
      modelType: modelType,
      modelSize: modelSize,
      bboxLineWidth: "2",
      fontSize: 17,
    };
    setModelLoaded(false);
    if (odModel) {
      odModel.dispose();
      odModel = null;
    }
    handtrack.load(defaultParams).then((model) => {
      odModel = model;
      setModelLoaded(true);
    });
  }, [modelSize, modelType]);

  useEffect(() => {
    const _canvas = document.getElementById("outputcanvas");
    setCanvas(_canvas);
    setContext(_canvas.getContext("2d"));
    setVideo(document.getElementById("videoel"));

    const canvasParentWidth = document.getElementById("canvasparent")
      .offsetWidth;
    if (canvasParentWidth < imageWidth) {
      // imageWidth = canvasParentWidth;
      _canvas.style.width = canvasParentWidth + "px";
    }

    const pageScrollHeight = getScrollHeight();

    // expand this window to scroll height
    document.getElementById("landingbox").style.height =
      pageScrollHeight + "px";
  }, []);

  useEffect(() => {
    const input = document.getElementById("fullimage0");
    if (odModel && modelLoaded && context && canvas) {
      odModel.detect(input).then((predictions) => {
        odModel.renderPredictions(predictions, canvas, context, input);
      });
    }
  }, [context, canvas, modelLoaded]);

  useEffect(() => {
    document.title = "Handtrack.js - Handtracking in Javascript! | Demo ";
    GaPageView();
    return () => {
      if (odModel) {
        odModel.dispose();
        console.log("model cleaned up");
      }
    };
  }, []);

  // run detect whenever config changes
  useEffect(() => {
    const input = document.getElementById("fullimage0");
    // console.log("config changed .. reloading and redetecting");

    if (odModel && input) {
      // const params = model.getModelParameters();
      const params = Object.assign({}, odModel.getModelParameters(), {
        scoreThreshold: scoreThreshold,
        modelType: modelType,
        modelSize: modelSize,
        flipHorizontal: imageFlip,
      });
      odModel.setModelParameters(params);

      if (odModel && context && canvas) {
        if (!isPlaying) {
          odModel.detect(input).then((predictions) => {
            odModel.renderPredictions(predictions, canvas, context, input);
          });
        }
      }
    }
  }, [
    scoreThreshold,
    imageFlip,
    modelSize,
    modelType,
    context,
    canvas,
    isPlaying,
  ]);

  const imageIdx = [];
  const maxImages = 10;
  for (let i = 0; i < maxImages; i++) {
    imageIdx.push(i);
  }

  const imageClick = (e) => {
    const fullImage = document.getElementById(
      "fullimage" + e.target.getAttribute("imageid")
    );

    detectImage(fullImage);

    setSelectedImage(e.target.getAttribute("imageid"));
    // console.log(predictions);
    stopVideoPlay();
  };

  const runDetection = async () => {
    if (vidOn) {
      const predictions = await odModel.detect(video);
      odModel.renderPredictions(predictions, canvas, context, video);
      // console.log(vidOn, "Predictions: ", predictions);
      requestAnimationFrame(() => {
        runDetection();
      });
    }
  };

  const webcamClick = (e) => {
    if (!isPlaying) {
      setCameraLoading(true);
      handtrack.startVideo(video).then(function (status) {
        // console.log("video started", status);
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
    }
  };

  const stopVideoPlay = () => {
    if (isPlaying || vidOn) {
      handtrack.stopVideo(video);
      setIsPlaying(false);
      vidOn = false;
    }
  };

  const poseListSmall = Object.keys(handtrack.colorMap).map((data, i) => {
    return (
      <div className="inline   " key={"poserow" + i}>
        {/* <div className=" items-center inline-flex">
          <span
            style={{
              border: "2px solid " + handtrack.colorMap[data],
            }}
            className=" rounded  mr-1 inline-block mb-1  px-2"
          >
            {data}
          </span>{" "}
        </div>  */}
        <div className=" items-center inline-flex">
          <div
            style={{ backgroundColor: handtrack.colorMap[data] }}
            className="inline-block w-2 h-3 mr-1 rounded "
          ></div>
          <span className=" pt-1 inline-block mb-1  px-1"> {data}</span>{" "}
        </div>
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
            (!modelLoaded
              ? "grayscale pointer-events-none"
              : " cursor-pointer  ") +
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
  const imageFullList = imageIdx.slice(0, maxImages).map((data, i) => {
    return (
      <div className="inline-block  " key={"imgrow" + i}>
        <img
          id={"fullimage" + i}
          alt={"sample of hands"}
          style={{ width: imageWidth + "px", height: imageHeight + "px" }}
          src={"images/samples/" + i + ".jpg"}
        />
      </div>
    );
  });

  return (
    <div id="landingbox" className="relative h-screen    ">
      <div className="w-full absolute  grid grid-rows-1 grid-flow-col  ">
        <div className="row-start-1 bg-indigo-600 col-start-1 h-32 "></div>
        <div
          style={{ height: "450px" }}
          className="row-start-1 col-start-1 w-full  bg-indigo-600 transform -skew-y-3 e"
        ></div>
      </div>
      <div className="w-full absolute  z-0 px-4">
        <div className="container-fluid  relative  text-white">
          {/* hero row */}
          <div className="md:flex flex-row  mt-10  z-0   md:-mb-2">
            <div className="flex-grow mr-7">
              <div className="flex flex-row  mr-3">
                <div className="h-20  mr-4">
                  <img
                    className="min-h-content  w-20"
                    src={process.env.PUBLIC_URL + "/images/logo.png"}
                    alt={"logo"}
                  />
                </div>
                <div className=" ">
                  <div className="text-3xl font-semibold">
                    {" "}
                    Handtrack.js{" "}
                    <span className="text-sm">v{handtrack.version}</span>
                  </div>
                  {/* <div className="mt-2">
                    {" "}
                    A library for prototyping hand tracking in Javascript.{" "}
                  </div> */}
                  <div className="mt-0 mb-1">
                    {" "}
                    Detect and track hands in Javascript. In the browser.
                  </div>
                  <div className="mb-3 text-sm pt-1  ">
                    <GithubStars />
                  </div>
                </div>
              </div>

              <div className="mt-6 ">
                <CameraDetect
                  cameraLoading={cameraLoading}
                  webcamClick={webcamClick}
                  model={modelLoaded}
                  isPlaying={isPlaying}
                  webCamError={webCamError}
                />
              </div>
            </div>
            <div className="pb-2 ">
              <Usage />
            </div>
          </div>

          {/* align right pose row */}

          <div
            className={
              // (odModel ? " " : "opacity-0 ") +
              " shadow-xl  md:shadow-none mb-3 p-3 rounded text-right md:bg-indigo-600  bg-indigo-800  text-sm  transition duration-500 "
            }
          >
            <span className="font-semibold mr-2"> 7 Supported Poses | </span>
            {poseListSmall}
          </div>

          {/* gallery row  */}
          <div className="container-fluid  md:flex flex-row">
            <div className="mb-3 md:pb-0 flex-grow md:mr-4 rounded  ">
              {/* model config row */}
              <div className="mb-4">
                <ModelConfig config={libConfig} model={modelLoaded} />
              </div>

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
            </div>
            <div>
              <div className="transition ease-in duration-700 bg-indigo-50 p-3 rounded relative">
                {/* {model && (
                  <div className="text-gray-800  mb-2 text-xs bg-indigo-50 rounded    ">
                    {poseListSmall}
                  </div>
                )} */}

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
                <div id="canvasparent" className="z-10 relative">
                  {!odModel && (
                    <div className="bg-indigo-200 animate-pulse border  rounded text-gray-600 text-sm absolute   w-full h-full   flex justify-center items-center">
                      {" "}
                      <div className="px-4">
                        {" "}
                        <Icons icon="loading" /> loading handtrack model ..{" "}
                      </div>
                    </div>
                  )}

                  <canvas
                    className={
                      (odModel ? " " : "opacity-0 ") +
                      " rounded  transition duration-500 "
                    }
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

          <div className="absolute top-0 opacity-0 pointer-events-none">
            {imageFullList}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
