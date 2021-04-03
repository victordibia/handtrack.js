import React, { useEffect, useState } from "react";
import "./landing.css";
// import CatalogFeatures from "./CatalogFeatures";
import Icons from "../helpers/Icons";
import * as handtrack from "../helpers/handtrack";

const Landing = () => {
  const [model, setModel] = useState(null);
  useEffect(() => {
    handtrack.load().then((model) => {
      setModel(model);
      console.log("model loaded", model);
    });
  }, []);
  const imageIdx = [];
  const maxImages = 10;
  for (let i = 0; i < 19; i++) {
    imageIdx.push(i);
  }

  const imageClick = (e) => {
    console.log(e.target.getAttribute("imageid"));
  };

  const imageList = imageIdx.slice(0, maxImages).map((data, i) => {
    return (
      <div className="inline-block  " key={"imgrow" + i}>
        <img
          imageid={i}
          onClick={imageClick}
          className={
            "rounded shadow transition duration-800 " +
            (!model ? "cursor-pointer grayscale pointer-events-none" : "  ")
          }
          style={{ objectFit: "cover", height: "130px", width: "100%" }}
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
                <div className="text-3xl font-semibold"> Handtrack.js </div>
                <div className="mt-2">
                  {" "}
                  Handtracking in Javascript. In the browser.{" "}
                </div>
              </div>
            </div>
            <div className="w-96 h-32 bg-gray-100 shadow-xl rounded p-2"></div>
          </div>
          {!model && (
            <div className="-mt-6">
              {" "}
              <Icons icon="loading" />{" "}
              <span className="text-sm">loading handtrack model ..</span>{" "}
            </div>
          )}
        </div>
      </div>
      <div className=" h-56  z-0 w-full   bg-indigo-600  transform skew-y-3"></div>
      <div className="absolute h-52  z-0 w-full  -mt-16     ">
        <div className="container-fluid px-4  flex flex-row">
          <div className=" flex-grow mr-4 bg-indigo-50 p-3   rounded  ">
            {/* <div className=" text-gray-600  text-sm mb-3">
              {" "}
              Select an image to see predictions.{" "}
            </div> */}
            <div className="grid grid-cols-4 gap-3">{imageList}</div>
          </div>
          <div className="bg-indigo-50 p-3   rounded ">
            <canvas
              className="border rounded"
              style={{ width: "350px", height: "350px" }}
              id="outputcanvas"
            ></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
