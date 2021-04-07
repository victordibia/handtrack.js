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
  const navlinks = [
    { label: "demo", url: "/" },
    { label: "docs", url: "/docs" },
    // { label: "docs", url: "/docs" },
  ];

  const navList = navlinks.map((data, i) => {
    return (
      <div
        key={"navrow" + i}
        className="navbarlinks h-full flex flex-col mr-3  text-sm justify-center "
      >
        <span className="text-white cursor-pointer font-semibold rounded   ">
          <NavLink exact to={data.url}>
            {data.label}
          </NavLink>
        </span>
      </div>
    );
  });
  return (
    <div className=" bg-indigo-600 z-50 ">
      <div className="  w-full bg-indigo-700">
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
              {navList}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
