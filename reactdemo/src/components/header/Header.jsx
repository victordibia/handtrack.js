/**
 * @license
 * Copyright 2019 Fast Forward Labs.
 * Written by / Contact : https://github.com/victordibia
 * NeuralQA - NeuralQA: Question Answering on Large Datasets with BERT.
 * Licensed under the MIT License (the "License");
 * =============================================================================
 */

import React from "react";
import { NavLink } from "react-router-dom";
import "./header.css";

const Header = () => {
  const appName = "Handtrack.js";
  const appDescription = "Handtracking in Javascript.";
  return (
    <div className="h-52 -mb-20 bg-indigo-600 related">
      <div className="absolute w-full bg-indigo-700">
        <div
          className="headermain  w-full container-fluid   border-l-0 border-r-0 border-t-0 border-gray-100 border-opacity-20 pt-2 pb-1 "
          aria-label={appDescription}
        >
          <div className="  w-full  container-fluid   headerrow  ">
            <div className="flex  h-full">
              <div className="h-full   flex flex-col justify-center mr-2 ml-2  ">
                <a href={process.env.PUBLIC_URL + "/#"}>
                  <img
                    className="h-8 w-8"
                    src={process.env.PUBLIC_URL + "/images/logo.png"}
                    alt={appDescription}
                  />
                </a>
              </div>
              <div className="apptitle  flex flex-col justify-center  mr-1">
                <div className="text-white  font-semibold text-sm  iblock mr-2 ml-1">
                  {" "}
                  {appName}{" "}
                </div>
              </div>
              <div className="h-full flex flex-col   text-sm justify-center ">
                <span className="  text-white p-2 px-4 font-semibold rounded bg-indigo-900">
                  <NavLink exact to="/">
                    Demo
                  </NavLink>
                </span>
              </div>
              {/* <div className="h100   flex flexjustifycenter  navbarlinks ">
              <NavLink exact to="/embeddings">
                Embeddings{" "}
              </NavLink>
            </div>
            <div className="h100   flex flexjustifycenter  navbarlinks ">
              <NavLink exact to="/livesearch">
                Live Search{" "}
              </NavLink>
            </div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="headerboost"> </div>
    </div>
  );
};

export default Header;
