/**
 * @license
 * Copyright 2019 Fast Forward Labs.
 * Written by Victor Dibia / Contact : https://github.com/victordibia
 * CaseQA - CaseQA: Question Answering on Large Datasets with BERT.
 * Licensed under the MIT License (the "License");
 * =============================================================================
 */

import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <div className="border-gray-200 text-gray-600   text-sm border-l-0 border-r-0 border-b-0  border w-full">
      <div style={{ zIndex: 999000 }} className=" container-fluid   w-full p-2">
        Made with <span className="pr-2">❤️</span> by{" "}
        <a rel="noreferrer" href="https://victordibia.com/" target="_blank">
          Victor Dibia
        </a>{" "}
      </div>
    </div>
  );
};

export default Footer;
