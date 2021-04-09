import React from "react";

const CodeWindow = ({ title, shadow = false, theme = "dark", children }) => {
  let windowClasses =
    theme === "dark"
      ? " bg-indigo-700 text-white "
      : " bg-white text-gray-600 ";
  windowClasses += shadow ? "shadow-xl" : " ";

  return (
    <div className="mt-3 rounded h-full ">
      <div
        className={
          windowClasses + " h-full   text-white   rounded text-sm p-3 px-5"
        }
      >
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
          <span className="ml-2 font-semibold   ">{title}</span>
          <div> {children} </div>
        </div>
      </div>
    </div>
  );
};

export default CodeWindow;
