import React, { useEffect, useState } from "react";
import "./landing.css";
// import CatalogFeatures from "./CatalogFeatures";
import Icons from "../helpers/Icons";
import * as handtrack from "../helpers/handtrack";
import CameraDetect from "./CameraDetect";
import WhatsNew from "./WhatsNew";
import Usage from "./Usage";
import ModelConfig from "./ModelConfig";

let vidOn = false;
const Landing = () => {
  // const [imageWidth, imageHeight] = [450, 431];
  const [imageWidth, imageHeight] = [400, 350];

  const defaultParams = {
    flipHorizontal: false,
    outputStride: 16,
    imageScaleFactor: 1,
    maxNumBoxes: 20,
    iouThreshold: 0.4, // 0.4 for nms iou > 60% is dropped
    scoreThreshold: 0.6,
    modelType: "ssd320fpnlite",
    modelSize: "base",
    bboxLineWidth: "2",
    fontSize: 17,
  };

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
    handtrack.load(defaultParams).then((model) => {
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

  const poseListSmall = Object.keys(handtrack.colorMap).map((data, i) => {
    return (
      <div className="inline   " key={"poserow" + i}>
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
    <div className="relative">
      <div className="w-full absolute  grid grid-rows-1 grid-flow-col  ">
        <div className="row-start-1 bg-indigo-600 col-start-1 h-32 "></div>
        <div className="row-start-1 h-96 col-start-1 w-full  bg-indigo-600 transform -skew-y-3 e"></div>
      </div>
      <div className="w-full absolute  z-10">
        <div className="container-fluid px-4   text-white">
          {/* hero row */}
          <div className="md:flex flex-row  mt-10   mb-1">
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
                    Detect and track 6 hand positions in Javascript. In the
                    browser.{" "}
                  </div>
                  <div className="mb-3 text-sm  bg-indipgo-800 rounded inline-block">
                    {/* {poseListSmall} */}
                  </div>
                </div>
              </div>

              <div className="mt-6 ">
                <CameraDetect
                  cameraLoading={cameraLoading}
                  webcamClick={webcamClick}
                  model={model}
                  isPlaying={isPlaying}
                  webCamError={webCamError}
                />
              </div>
            </div>
            <div className="pb-2 ">
              <Usage />
            </div>
          </div>

          {/* gallery row  */}

          <div className="container-fluid  md:flex flex-row">
            <div className="mb-3 md:pb-0 flex-grow md:mr-4 rounded  ">
              {/* model config row */}
              <div className="mb-4">
                <ModelConfig />
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
                {/* <div className="text-gray-800  mb-2 text-sm bg-indigo-200 rounded px-2  ">
                  {poseListSmall}
                </div> */}

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
                    <div className="text-gray-600 text-sm absolute   w-full h-full   flex justify-center items-center">
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

          <img
            id="inputholder"
            alt="hidden holder for larger version of samples."
            src="images/samples/0.jpg"
            className="hidden"
            style={{ width: imageWidth + "px", height: imageHeight + "px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Landing;
