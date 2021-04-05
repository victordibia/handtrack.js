import React, { useEffect, useState } from "react";
import * as handtrack from "../helpers/handtrack";

const SimpleDemo = () => {
  const [imageWidth, imageHeight] = [400, 350];

  const [model, setModel] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [context, setContext] = useState(null);

  // load model on page load
  useEffect(() => {
    handtrack.load().then((model) => {
      setModel(model);
    });

    const _canvas = document.getElementById("outputcanvas");
    setCanvas(_canvas);
    setContext(_canvas.getContext("2d"));
  }, []);

  // run detection  and visualize boxes for a sample image once model and canvas are loaded.
  useEffect(() => {
    const input = document.getElementById("inputholder");
    if (model && context && canvas) {
      model.detect(input).then((predictions) => {
        model.renderPredictions(predictions, canvas, context, input);
      });
    }
  }, [model, context, canvas]);

  // delete model from gpu memory when this component is done.
  useEffect(() => {
    return () => {
      if (model) {
        console.log("model cleaned up");
      }
    };
  }, [model]);

  return (
    <div className="-mb-10   relative">
      <div className="absolute w-full   z-10 ">
        <div className="container-fluid px-4  text-white">
          <div className="absolute z-0 w-full        ">
            {!model && <div> loading model .. </div>}
            <canvas
              className=" rounded  transition duration-500 "
              style={{
                width: imageWidth + "px",
                height: imageHeight + "px",
              }}
              id="outputcanvas"
            ></canvas>
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
    </div>
  );
};

export default SimpleDemo;
