import React, { useEffect } from "react";
import { GaPageView, getScrollHeight } from "../helpers/HelperFunctions";
import * as handtrack from "../helpers/handtrack";
import Usage from "../Landing/Usage";
import CodeWindow from "../Landing/CodeWindow";

const Docs = () => {
  // load model on page load
  useEffect(() => {
    document.title =
      "Handtrack.js - Handtracking in Javascript! | Documentation ";
    GaPageView();
    const pageScrollHeight = getScrollHeight();

    // expand this window to scroll height
    document.getElementById("documentationbox").style.height =
      pageScrollHeight + "px";
  }, []);

  return (
    <div id="documentationbox" className="relative  h-screen h-full ">
      <div className="w-full   absolute  grid grid-rows-1 grid-flow-col z-0 ">
        <div className="row-start-1 bg-indigo-600 col-start-1 h-16 "></div>
        <div className="row-start-1 h-96 col-start-1 w-full  bg-indigo-600 transform -skew-y-3 e"></div>
      </div>
      <div className="absolute w-full z-10 px-4  h-full">
        <div className="container-fluid  flex flex-col h-full text-white">
          <div className="flex">
            <div className="flex-grow">
              <div className="  font-semibold  mt-10 text-3xl">
                Documentation{" "}
                <span className="text-sm ml-1">v{handtrack.version}</span>
              </div>
              <div>
                {" "}
                Updated v0.0.2 docs are bing compiled. See{" "}
                <a
                  className="underline"
                  href="https://github.com/victordibia/handtrack.js"
                >
                  github
                </a>{" "}
                for more.
              </div>
            </div>
          </div>
          <div className="rounded mt-16 text-gray-700 flex-grow bg-gradient-to-b   from-indigo-50 via-indigo-50  to-white">
            <div className="px-4   flex md:flex rounded md:-mt-28">
              <div className="md:flex-grow"></div>
              <div className=" mr-0">
                <Usage />
              </div>
            </div>
            <div className="mt-3 px-4">
              Handtrack.js can be imported into your application either via a
              script tag or via npm.
              <br />
              Once imported, handtrack.js provides an asynchronous{" "}
              <span className="text-yellow-600 font-semibold">load()</span>{" "}
              method which returns a promise for a object detection model
              object.
            </div>
            <span className="hidden">
              <div> Importing handtrack.js</div>
              <div> Handtrack.js Methods </div>
              <div> Model Methods </div>
            </span>
            <div className="grid grid-col-2 md:grid-cols-3   w-full p-3 px-4 gap-4">
              <div className="col-span-1">
                <CodeWindow
                  title="Library Helper Methods"
                  shadow={false}
                  theme="light"
                >
                  <br />
                  <br />
                  <br />
                  <br />
                </CodeWindow>{" "}
              </div>
              <div className="md:col-span-2 h-full">
                <CodeWindow
                  title="Model Parameters"
                  shadow={false}
                  theme="light"
                ></CodeWindow>{" "}
              </div>
              <div className="col-span-1">
                <CodeWindow title="Model Methods" shadow={false} theme="light">
                  <br />
                  <br />
                  <br />
                  <br />
                </CodeWindow>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
